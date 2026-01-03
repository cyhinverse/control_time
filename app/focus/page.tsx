import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FocusTimer } from "@/components/focus-timer";
import { Timer } from "lucide-react";

export default async function FocusPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Timer className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Focus Timer</h1>
          <p className="text-sm text-muted-foreground">
            Stay focused with Pomodoro technique
          </p>
        </div>
      </header>

      {/* Timer */}
      <div className="flex-1 flex items-center justify-center p-6">
        <FocusTimer />
      </div>
    </div>
  );
}
