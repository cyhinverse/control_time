"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarPlus,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  startTime: string | null;
}

interface DailyPlanningViewProps {
  tasks: Task[];
  scheduledToday: Task[];
}

export function DailyPlanningView({
  tasks,
  scheduledToday,
}: DailyPlanningViewProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function scheduleForToday(taskId: string) {
    setLoadingId(taskId);
    const now = new Date();
    now.setHours(9, 0, 0, 0);

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startTime: now.toISOString() }),
      });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  async function markComplete(taskId: string) {
    setLoadingId(taskId);
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      });
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
      {/* Inbox Review */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Inbox className="size-4 text-muted-foreground" />
            Inbox
          </CardTitle>
          <CardDescription className="text-xs">
            {tasks.length} tasks to review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[60vh] overflow-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="size-8 mx-auto text-green-500/50 mb-2" />
              <p className="text-sm text-muted-foreground">All done!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "border border-transparent hover:bg-muted/50 hover:border-border",
                  "transition-colors",
                  loadingId === task.id && "opacity-50"
                )}
              >
                <Checkbox
                  onCheckedChange={() => markComplete(task.id)}
                  disabled={loadingId === task.id}
                  className="size-4"
                />
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scheduleForToday(task.id)}
                  disabled={loadingId === task.id}
                  className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                >
                  {loadingId === task.id ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <>
                      <CalendarPlus className="size-3 mr-1" />
                      Today
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Today's Plan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-primary" />
            Today
          </CardTitle>
          <CardDescription className="text-xs">
            {scheduledToday.length} tasks scheduled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[60vh] overflow-auto">
          {scheduledToday.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="size-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                No tasks scheduled
              </p>
              <p className="text-xs text-muted-foreground/60">
                Add tasks from inbox
              </p>
            </div>
          ) : (
            scheduledToday.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "bg-primary/5 border border-primary/10",
                  loadingId === task.id && "opacity-50"
                )}
              >
                <Checkbox
                  onCheckedChange={() => markComplete(task.id)}
                  disabled={loadingId === task.id}
                  className="size-4"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{task.title}</span>
                  {task.startTime && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
