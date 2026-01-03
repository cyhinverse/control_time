import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarView } from "@/components/calendar-view";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
} from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status?: string;
  priority?: string | null;
  isRecurring?: boolean;
  originalTaskId?: string;
}

// Generate recurring event instances within a date range
function generateRecurringInstances(
  task: {
    id: string;
    title: string;
    startTime: Date | null;
    endTime: Date | null;
    dueDate: Date | null;
    status: string;
    priority: string;
    isRecurring: boolean;
    recurrence: string | null;
    recurringDays: string | null;
  },
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  const baseStart = task.startTime
    ? new Date(task.startTime)
    : task.dueDate
    ? new Date(new Date(task.dueDate).setHours(9, 0, 0, 0))
    : null;

  if (!baseStart) return events;

  const duration = task.endTime
    ? new Date(task.endTime).getTime() - baseStart.getTime()
    : 60 * 60 * 1000; // Default 1 hour

  // If not recurring, just return single event
  if (!task.isRecurring || !task.recurrence) {
    events.push({
      id: task.id,
      title: task.title,
      start: baseStart,
      end: new Date(baseStart.getTime() + duration),
      status: task.status,
      priority: task.priority,
      isRecurring: false,
    });
    return events;
  }

  // Generate recurring instances
  let currentDate = new Date(baseStart);
  let instanceCount = 0;
  const maxInstances = 365; // Limit to prevent infinite loops

  // Start from baseStart and generate forward
  while (instanceCount < maxInstances) {
    // Stop if we're past the range end
    if (isAfter(currentDate, rangeEnd)) {
      break;
    }

    // Only add if current date is within or after range start
    if (!isBefore(currentDate, rangeStart)) {
      events.push({
        id: `${task.id}-${instanceCount}`,
        title: task.title,
        start: new Date(currentDate),
        end: new Date(currentDate.getTime() + duration),
        status: task.status,
        priority: task.priority,
        isRecurring: true,
        originalTaskId: task.id,
      });
    }

    // Move to next occurrence
    switch (task.recurrence) {
      case "DAILY":
        currentDate = addDays(currentDate, 1);
        break;
      case "WEEKLY":
        currentDate = addWeeks(currentDate, 1);
        break;
      case "MONTHLY":
        currentDate = addMonths(currentDate, 1);
        break;
      case "YEARLY":
        currentDate = addYears(currentDate, 1);
        break;
      default:
        currentDate = addDays(currentDate, 1);
    }

    instanceCount++;
  }

  return events;
}

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Get all tasks with start times or due dates for calendar
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      OR: [{ startTime: { not: null } }, { dueDate: { not: null } }],
    },
    orderBy: { startTime: "asc" },
  });

  // Define calendar range (3 months before and after current date)
  const now = new Date();
  const rangeStart = startOfMonth(addMonths(now, -1));
  const rangeEnd = endOfMonth(addMonths(now, 2));

  // Convert tasks to calendar events format with recurring support
  const events: CalendarEvent[] = [];

  for (const task of tasks) {
    const taskEvents = generateRecurringInstances(task, rangeStart, rangeEnd);
    events.push(...taskEvents);
  }

  // Sort events by start time
  events.sort((a, b) => a.start.getTime() - b.start.getTime());

  return (
    <div className="h-[calc(100vh-4rem)]">
      <CalendarView events={events} />
    </div>
  );
}
