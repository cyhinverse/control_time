"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit3,
  Flag,
  Check,
  X,
  Repeat,
  FileText,
  AlarmClock,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TaskDetailDialog } from "./task-detail-dialog";
import { playCompletionSound } from "@/lib/settings";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string;
  dueDate?: string | null;
  startTime?: string | null;
  isRecurring?: boolean;
  recurrence?: string | null;
}

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
}

export function TaskItem({ task, isDragging }: TaskItemProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showDetail, setShowDetail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  async function updateStatus(checked: boolean) {
    if (!checked) return;
    setIsCompleting(true);
    setIsPending(true);

    // Play completion sound
    playCompletionSound();

    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  async function updatePriority(priority: string) {
    setIsPending(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  async function updateTitle() {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }

    setIsPending(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      setIsEditing(false);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditTitle(task.title);
  }

  async function deleteTask() {
    setIsPending(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  async function snoozeTask(hours?: number, days?: number) {
    const snoozeDate = new Date();
    if (hours) {
      snoozeDate.setHours(snoozeDate.getHours() + hours);
    }
    if (days) {
      snoozeDate.setDate(snoozeDate.getDate() + days);
      snoozeDate.setHours(9, 0, 0, 0);
    }

    setIsPending(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: snoozeDate.toISOString(),
          dueDate: snoozeDate.toISOString(),
        }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  const priorityConfig = {
    HIGH: { color: "text-red-500", bg: "bg-red-500/10", label: "High" },
    MEDIUM: {
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      label: "Medium",
    },
    LOW: { color: "text-blue-500", bg: "bg-blue-500/10", label: "Low" },
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg",
        "border border-transparent",
        "transition-all duration-200",
        "hover:bg-muted/50 hover:border-border",
        isCompleting && "opacity-50 scale-95",
        isPending && "pointer-events-none",
        isDragging && "shadow-lg ring-2 ring-primary/30"
      )}
    >
      {/* Checkbox */}
      <Checkbox
        id={task.id}
        checked={task.status === "DONE" || isCompleting}
        onCheckedChange={(checked) => updateStatus(checked as boolean)}
        disabled={isPending || isEditing}
        className={cn(
          "size-4 rounded border-2",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          "border-muted-foreground/30 hover:border-primary/50"
        )}
      />

      {/* Task content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateTitle();
                if (e.key === "Escape") cancelEdit();
              }}
              className="h-7 text-sm py-0"
            />
            <button
              onClick={updateTitle}
              className="p-1 rounded hover:bg-green-500/10 text-green-600"
            >
              <Check className="size-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 rounded hover:bg-red-500/10 text-red-500"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <span
            className={cn(
              "text-sm",
              (task.status === "DONE" || isCompleting) &&
                "line-through text-muted-foreground"
            )}
            onDoubleClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}

        {/* Metadata */}
        {(task.dueDate ||
          task.startTime ||
          task.priority ||
          task.isRecurring ||
          task.description) && (
          <div className="flex items-center gap-2 mt-1">
            {task.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 text-xs font-normal",
                  priorityConfig[task.priority as keyof typeof priorityConfig]
                    ?.bg,
                  priorityConfig[task.priority as keyof typeof priorityConfig]
                    ?.color
                )}
              >
                <Flag className="size-3" />
                {
                  priorityConfig[task.priority as keyof typeof priorityConfig]
                    ?.label
                }
              </Badge>
            )}
            {task.isRecurring && (
              <Badge
                variant="outline"
                className="gap-1 text-xs font-normal text-purple-500 bg-purple-500/10 border-purple-500/20"
              >
                <Repeat className="size-3" />
                {task.recurrence?.toLowerCase()}
              </Badge>
            )}
            {task.description && (
              <span className="text-muted-foreground">
                <FileText className="size-3" />
              </span>
            )}
            {task.startTime && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {new Date(task.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {new Date(task.dueDate).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => setShowDetail(true)}
            >
              <Eye className="size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => setIsEditing(true)}
            >
              <Edit3 className="size-4" />
              Edit Title
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* Snooze Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2 cursor-pointer">
                <AlarmClock className="size-4" />
                Snooze
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onSelect={() => snoozeTask(3)}
                >
                  <Clock className="size-4" />
                  Later today (+3h)
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onSelect={() => snoozeTask(undefined, 1)}
                >
                  <Calendar className="size-4" />
                  Tomorrow
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onSelect={() => snoozeTask(undefined, 7)}
                >
                  <Calendar className="size-4" />
                  Next week
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => updatePriority("HIGH")}
            >
              <Flag className="size-4 text-red-500" />
              High priority
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => updatePriority("MEDIUM")}
            >
              <Flag className="size-4 text-orange-500" />
              Medium priority
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onSelect={() => updatePriority("LOW")}
            >
              <Flag className="size-4 text-blue-500" />
              Low priority
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => deleteTask()}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={task}
        open={showDetail}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );
}
