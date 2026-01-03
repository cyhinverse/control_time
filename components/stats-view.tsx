"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Flag,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsViewProps {
  totalTasks: number;
  completedTotal: number;
  pendingTasks: number;
  dailyStats: { date: string; completed: number }[];
  priorityStats: { high: number; medium: number; low: number };
  recentCompleted: { id: string; title: string; updatedAt: Date }[];
}

export function StatsView({
  totalTasks,
  completedTotal,
  pendingTasks,
  dailyStats,
  priorityStats,
  recentCompleted,
}: StatsViewProps) {
  const completionRate =
    totalTasks > 0 ? Math.round((completedTotal / totalTasks) * 100) : 0;
  const maxDaily = Math.max(...dailyStats.map((d) => d.completed), 1);
  const weeklyTotal = dailyStats.reduce((sum, d) => sum + d.completed, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTasks}</p>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedTotal}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Clock className="size-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingTasks}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="size-4" />
                Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 gap-2">
                {dailyStats.map((day, index) => (
                  <div
                    key={day.date}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: `${(day.completed / maxDaily) * 100}%`,
                      }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className={cn(
                        "w-full rounded-t-sm min-h-[4px]",
                        day.completed > 0 ? "bg-primary" : "bg-muted"
                      )}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {day.date}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">
                    {weeklyTotal} tasks
                  </span>{" "}
                  completed this week
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Flag className="size-4" />
                By Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* High Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    High Priority
                  </span>
                  <span className="font-medium">{priorityStats.high}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        totalTasks > 0
                          ? (priorityStats.high / totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>

              {/* Medium Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-yellow-500" />
                    Medium Priority
                  </span>
                  <span className="font-medium">{priorityStats.medium}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        totalTasks > 0
                          ? (priorityStats.medium / totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
              </div>

              {/* Low Priority */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-500" />
                    Low Priority
                  </span>
                  <span className="font-medium">{priorityStats.low}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        totalTasks > 0
                          ? (priorityStats.low / totalTasks) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-500" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCompleted.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No completed tasks yet
              </p>
            ) : (
              <div className="space-y-2">
                {recentCompleted.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                  >
                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    <span className="text-sm flex-1 truncate">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
