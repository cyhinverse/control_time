import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsView } from "@/components/stats-view";
import { BarChart3 } from "lucide-react";

export default async function StatsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Get stats for the last 7 days
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Tasks completed in last 7 days
  const completedTasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      status: "DONE",
      updatedAt: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // All tasks created
  const totalTasks = await prisma.task.count({
    where: { userId: session.user.id },
  });

  const pendingTasks = await prisma.task.count({
    where: {
      userId: session.user.id,
      status: { not: "DONE" },
    },
  });

  const completedTotal = await prisma.task.count({
    where: {
      userId: session.user.id,
      status: "DONE",
    },
  });

  // Group by day for chart
  const dailyStats: { date: string; completed: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = completedTasks.filter((t) => {
      const taskDate = new Date(t.updatedAt);
      return taskDate >= date && taskDate < nextDate;
    }).length;

    dailyStats.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      completed: count,
    });
  }

  // Tasks by priority
  const highPriority = await prisma.task.count({
    where: { userId: session.user.id, priority: "HIGH" },
  });
  const mediumPriority = await prisma.task.count({
    where: { userId: session.user.id, priority: "MEDIUM" },
  });
  const lowPriority = await prisma.task.count({
    where: { userId: session.user.id, priority: "LOW" },
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
          <BarChart3 className="size-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Statistics</h1>
          <p className="text-sm text-muted-foreground">
            Track your productivity over time
          </p>
        </div>
      </header>

      {/* Stats Content */}
      <div className="flex-1 overflow-auto p-6">
        <StatsView
          totalTasks={totalTasks}
          completedTotal={completedTotal}
          pendingTasks={pendingTasks}
          dailyStats={dailyStats}
          priorityStats={{
            high: highPriority,
            medium: mediumPriority,
            low: lowPriority,
          }}
          recentCompleted={completedTasks.slice(0, 5)}
        />
      </div>
    </div>
  );
}
