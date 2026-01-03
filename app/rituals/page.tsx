import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DailyPlanningView } from "@/components/daily-planning-view";
import { Zap } from "lucide-react";

export default async function RitualsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      status: "TODO",
    },
    orderBy: { createdAt: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const scheduledToday = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      startTime: {
        gte: today,
        lt: tomorrow,
      },
    },
    orderBy: { startTime: "asc" },
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="h-full flex flex-col px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
          <Zap className="size-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{greeting()}</h1>
          <p className="text-sm text-muted-foreground">
            Review your inbox and plan your day
          </p>
        </div>
      </div>

      <DailyPlanningView
        tasks={tasks.map((task) => ({
          ...task,
          startTime: task.startTime?.toISOString() ?? null,
        }))}
        scheduledToday={scheduledToday.map((task) => ({
          ...task,
          startTime: task.startTime?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
