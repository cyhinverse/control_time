"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as chrono from "chrono-node";
import {
  CalendarPlus,
  Inbox,
  Zap,
  Calendar,
  Search,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function CommandBar() {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [parsedDate, setParsedDate] = React.useState<Date | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (inputValue) {
      const result = chrono.parseDate(inputValue);
      setParsedDate(result);
    } else {
      setParsedDate(null);
    }
  }, [inputValue]);

  async function createTask() {
    if (!inputValue.trim()) return;

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: inputValue,
          scheduledAt: parsedDate?.toISOString(),
        }),
      });
      setInputValue("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  const formatParsedDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="rounded-lg overflow-hidden border border-border bg-background shadow-lg">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="size-4 text-muted-foreground mr-3" />
          <CommandInput
            placeholder="Type a command or search..."
            value={inputValue}
            onValueChange={setInputValue}
            className="border-0 focus:ring-0 py-4 text-sm placeholder:text-muted-foreground/60"
          />
          <kbd className="kbd">ESC</kbd>
        </div>

        <CommandList className="max-h-[400px] overflow-auto p-2">
          <CommandEmpty className="py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Search className="size-6 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No results found</p>
            </div>
          </CommandEmpty>

          {/* Quick Create Task */}
          {inputValue && (
            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={createTask}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer",
                  "aria-selected:bg-muted"
                )}
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Create: &quot;{inputValue}&quot;
                  </p>
                  {parsedDate && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatParsedDate(parsedDate)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="kbd">Enter</kbd>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </div>
              </CommandItem>
            </CommandGroup>
          )}

          <CommandSeparator className="my-2" />

          {/* Navigation */}
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                router.push("/");
                setOpen(false);
              }}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer aria-selected:bg-muted"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Inbox className="size-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Go to Inbox</p>
                <p className="text-xs text-muted-foreground">
                  View all your tasks
                </p>
              </div>
              <kbd className="kbd">G I</kbd>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/calendar");
                setOpen(false);
              }}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer aria-selected:bg-muted"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Calendar className="size-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Go to Calendar</p>
                <p className="text-xs text-muted-foreground">
                  Time blocking view
                </p>
              </div>
              <kbd className="kbd">G C</kbd>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                router.push("/rituals");
                setOpen(false);
              }}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer aria-selected:bg-muted"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Zap className="size-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Daily Planning</p>
                <p className="text-xs text-muted-foreground">
                  Review and plan your day
                </p>
              </div>
              <kbd className="kbd">G R</kbd>
            </CommandItem>
          </CommandGroup>

          {/* Tips */}
          <div className="mt-3 px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <CalendarPlus className="size-3.5" />
              <span>
                <span className="font-medium">Tip:</span> Type &quot;Meeting
                tomorrow at 9am&quot; to create a scheduled task
              </span>
            </p>
          </div>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
