import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  User2,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  LogOut,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Get user stats
  const totalTasks = await prisma.task.count({
    where: { userId: session.user.id },
  });

  const completedTasks = await prisma.task.count({
    where: { userId: session.user.id, status: "DONE" },
  });

  const pendingTasks = await prisma.task.count({
    where: { userId: session.user.id, status: "TODO" },
  });

  // Get tasks completed this week
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const completedThisWeek = await prisma.task.count({
    where: {
      userId: session.user.id,
      status: "DONE",
      updatedAt: { gte: startOfWeek },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-full flex flex-col px-6 py-4 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <User2 className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl pb-8">
        {/* Profile Card */}
        <Card className="lg:row-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <Avatar className="size-20">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="bg-primary/10">
                  <User2 className="size-10 text-primary" />
                </AvatarFallback>
              </Avatar>

              {/* Name & Email */}
              <div className="mt-4 space-y-1">
                <h2 className="text-lg font-semibold">
                  {session.user.name || "User"}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span>{session.user.email}</span>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                <span>Member since {memberSince}</span>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 w-full grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {completedTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 text-center">
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {pendingTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>

              {/* Sign Out */}
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="w-full mt-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="size-4 mr-2" />
                  Sign out
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="size-4 text-primary" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{completionRate}%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-500" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{completedThisWeek}</span>
              <span className="text-sm text-muted-foreground mb-0.5">
                tasks
              </span>
            </div>
            <div className="mt-3 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-6 rounded ${
                    i < completedThisWeek % 7 ? "bg-green-500/30" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-blue-500" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">
                  {totalTasks > 0
                    ? Math.round(
                        completedTasks /
                          Math.max(
                            1,
                            Math.ceil(
                              (Date.now() -
                                (user?.createdAt?.getTime() || Date.now())) /
                                (1000 * 60 * 60 * 24 * 7)
                            )
                          )
                      )
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Per week</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">🔥</p>
                <p className="text-xs text-muted-foreground">Keep going!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
