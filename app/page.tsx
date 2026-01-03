import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateTask } from "@/components/create-task";
import { DailyTaskList } from "@/components/daily-task-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Inbox as InboxIcon,
  CheckCircle2,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md glass-modal">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Zap className="size-8" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome to Control Time
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your productivity command center
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
              className="w-full"
            >
              <Button className="w-full h-11 text-sm font-medium" size="lg">
                <svg className="size-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </form>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50">
                <Target className="size-4 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center">
                  Time Blocking
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50">
                <CheckCircle2 className="size-4 text-green-500" />
                <span className="text-[10px] text-muted-foreground text-center">
                  Task Manager
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-muted/50">
                <TrendingUp className="size-4 text-blue-500" />
                <span className="text-[10px] text-muted-foreground text-center">
                  Daily Rituals
                </span>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground/60 pt-2">
              Secure authentication powered by OAuth 2.0
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      status: { not: "DONE" },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const completedToday = await prisma.task.count({
    where: {
      userId: session.user.id,
      status: "DONE",
      updatedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  const totalTasks = tasks.length + completedToday;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <InboxIcon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Inbox</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{tasks.length} tasks</span>
              <span>•</span>
              <span className="text-green-600 dark:text-green-400">
                {completedToday} done today
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">{progressPercent}%</span>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Task */}
          <CreateTask />

          {/* Task List - Grouped by Day */}
          <div className="space-y-1">
            <DailyTaskList
              tasks={tasks.map((task) => ({
                ...task,
                dueDate: task.dueDate?.toISOString() ?? null,
                startTime: task.startTime?.toISOString() ?? null,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
