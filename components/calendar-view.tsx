"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  setHours,
  getHours,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSettings, type AppSettings } from "@/lib/settings";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  status?: string;
  priority?: string | null;
  isRecurring?: boolean;
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

type ViewType = "day" | "week" | "month";

export function CalendarView({ events: rawEvents }: CalendarViewProps) {
  // Convert string dates to Date objects (needed because dates get serialized when passed from server to client)
  const events = rawEvents.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  const [view, setView] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Load settings
  useEffect(() => {
    setSettings(getSettings());

    const handleSettingsChange = (e: CustomEvent<AppSettings>) => {
      setSettings(e.detail);
    };

    window.addEventListener(
      "settings-changed",
      handleSettingsChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "settings-changed",
        handleSettingsChange as EventListener
      );
    };
  }, []);

  // Week start day from settings (0 = Sunday, 1 = Monday)
  const weekStartsOn: 0 | 1 = settings?.weekStart === "sunday" ? 0 : 1;

  const navigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }
    const modifier = direction === "prev" ? -1 : 1;
    if (view === "month") {
      setCurrentDate((d) =>
        modifier === 1 ? addMonths(d, 1) : subMonths(d, 1)
      );
    } else if (view === "week") {
      setCurrentDate((d) => (modifier === 1 ? addWeeks(d, 1) : subWeeks(d, 1)));
    } else {
      setCurrentDate((d) => (modifier === 1 ? addDays(d, 1) : subDays(d, 1)));
    }
  };

  const getDateRange = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn });
      const end = endOfWeek(currentDate, { weekStartsOn });
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
      }
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    return format(currentDate, "EEEE, MMMM d, yyyy");
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.start), day));
  };

  const getEventsForHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day) && getHours(eventDate) === hour;
    });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn }),
    end: endOfWeek(currentDate, { weekStartsOn }),
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
  const monthDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getPriorityColor = (priority?: string | null, status?: string) => {
    if (status === "DONE") return "bg-gray-400/80";
    if (priority === "HIGH") return "bg-red-500";
    if (priority === "MEDIUM") return "bg-amber-500";
    if (priority === "LOW") return "bg-blue-500";
    return "bg-violet-500";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <CalendarIcon className="size-5 text-violet-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Calendar</h1>
            <p className="text-sm text-muted-foreground">{getDateRange()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => navigate("prev")}
              className="size-8 rounded-md hover:bg-background flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => navigate("today")}
              className="px-3 py-1.5 text-sm font-medium hover:bg-background rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigate("next")}
              className="size-8 rounded-md hover:bg-background flex items-center justify-center transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                  view === v
                    ? "bg-violet-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                )}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto">
        {view === "month" ? (
          <MonthView
            days={monthDays}
            currentDate={currentDate}
            getEventsForDay={getEventsForDay}
            getPriorityColor={getPriorityColor}
            weekStartsOn={weekStartsOn}
          />
        ) : (
          <TimeGridView
            view={view}
            days={view === "week" ? weekDays : [currentDate]}
            hours={hours}
            getEventsForHour={getEventsForHour}
            getPriorityColor={getPriorityColor}
          />
        )}
      </div>
    </div>
  );
}

function MonthView({
  days,
  currentDate,
  getEventsForDay,
  getPriorityColor,
  weekStartsOn = 0,
}: {
  days: Date[];
  currentDate: Date;
  getEventsForDay: (day: Date) => CalendarEvent[];
  getPriorityColor: (priority?: string | null, status?: string) => string;
  weekStartsOn?: 0 | 1;
}) {
  const weekDayNamesFromSunday = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const weekDayNamesFromMonday = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  const weekDayNames =
    weekStartsOn === 1 ? weekDayNamesFromMonday : weekDayNamesFromSunday;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {weekDayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-px bg-border/50 rounded-xl overflow-hidden">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "bg-background p-2 min-h-[100px] transition-colors hover:bg-muted/30",
                !isCurrentMonth && "bg-muted/20"
              )}
            >
              <div
                className={cn(
                  "text-sm mb-1 w-7 h-7 flex items-center justify-center rounded-full",
                  today && "bg-violet-500 text-white font-semibold",
                  !today && !isCurrentMonth && "text-muted-foreground/50",
                  !today && isCurrentMonth && "text-foreground font-medium"
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-[11px] text-white px-1.5 py-0.5 rounded truncate flex items-center gap-1",
                      getPriorityColor(event.priority, event.status)
                    )}
                    title={event.title}
                  >
                    {event.isRecurring && (
                      <Repeat className="size-2.5 shrink-0" />
                    )}
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-muted-foreground font-medium pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeGridView({
  view,
  days,
  hours,
  getEventsForHour,
  getPriorityColor,
}: {
  view: ViewType;
  days: Date[];
  hours: number[];
  getEventsForHour: (day: Date, hour: number) => CalendarEvent[];
  getPriorityColor: (priority?: string | null, status?: string) => string;
}) {
  const currentHour = new Date().getHours();

  return (
    <div className="h-full flex flex-col">
      {/* Header with day names */}
      <div
        className={cn(
          "grid border-b border-border/50 bg-muted/30 sticky top-0 z-10",
          view === "week"
            ? "grid-cols-[60px_repeat(7,1fr)]"
            : "grid-cols-[60px_1fr]"
        )}
      >
        <div className="border-r border-border/30" />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "text-center py-3 border-r border-border/30 last:border-r-0",
              isToday(day) && "bg-violet-500/5"
            )}
          >
            <div className="text-xs font-medium text-muted-foreground uppercase">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-lg font-semibold mt-0.5",
                isToday(day) ? "text-violet-500" : "text-foreground"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div
          className={cn(
            "grid min-h-full",
            view === "week"
              ? "grid-cols-[60px_repeat(7,1fr)]"
              : "grid-cols-[60px_1fr]"
          )}
        >
          {/* Time labels */}
          <div className="border-r border-border/30 pt-4">
            {hours.map((hour, index) => (
              <div
                key={hour}
                className={cn(
                  "h-14 border-b border-border/20 pr-2 flex items-start justify-end",
                  index === 0 && "-mt-4"
                )}
              >
                <span className="text-[11px] text-muted-foreground font-medium">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-border/30 last:border-r-0 relative",
                isToday(day) && "bg-violet-500/[0.02]"
              )}
            >
              {hours.map((hour) => {
                const hourEvents = getEventsForHour(day, hour);
                const isCurrentHour = isToday(day) && hour === currentHour;

                return (
                  <div
                    key={hour}
                    className={cn(
                      "h-14 border-b border-border/20 relative group hover:bg-muted/30 transition-colors",
                      isCurrentHour && "bg-violet-500/5"
                    )}
                  >
                    {/* Current time indicator */}
                    {isCurrentHour && (
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center z-20">
                        <div className="size-2 rounded-full bg-red-500 -ml-1" />
                        <div className="flex-1 h-0.5 bg-red-500" />
                      </div>
                    )}

                    {/* Events */}
                    {hourEvents.map((event, idx) => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute inset-x-1 rounded-md px-2 py-1 text-white text-xs shadow-sm overflow-hidden",
                          "hover:ring-2 hover:ring-white/30 transition-all cursor-pointer",
                          getPriorityColor(event.priority, event.status)
                        )}
                        style={{
                          top: `${idx * 2 + 2}px`,
                          minHeight: "48px",
                          zIndex: 10 + idx,
                        }}
                      >
                        <div className="font-medium truncate flex items-center gap-1">
                          {event.isRecurring && (
                            <Repeat className="size-3 shrink-0" />
                          )}
                          <span className="truncate">{event.title}</span>
                        </div>
                        <div className="text-[10px] opacity-80">
                          {format(new Date(event.start), "h:mm a")} -{" "}
                          {format(new Date(event.end), "h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
