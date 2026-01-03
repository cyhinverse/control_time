"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Flag,
  Repeat,
  AlarmClock,
  FileText,
  Check,
  Sun,
  Sunrise,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

const RECURRENCE_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const SNOOZE_OPTIONS = [
  { label: "Later today", hours: 3, icon: Clock },
  { label: "Tomorrow", days: 1, icon: Sunrise },
  { label: "Next week", days: 7, icon: CalendarDays },
];

export function TaskDetailDialog({
  task,
  open,
  onClose,
}: TaskDetailDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "MEDIUM");
  const [startTime, setStartTime] = useState(
    task.startTime ? new Date(task.startTime).toISOString().slice(0, 16) : ""
  );
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false);
  const [recurrence, setRecurrence] = useState(task.recurrence || "DAILY");
  const [isSaving, setIsSaving] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          priority,
          startTime: startTime ? new Date(startTime).toISOString() : null,
          dueDate: startTime ? new Date(startTime).toISOString() : null,
          isRecurring,
          recurrence: isRecurring ? recurrence : null,
        }),
      });
      router.refresh();
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSnooze(option: (typeof SNOOZE_OPTIONS)[0]) {
    const snoozeDate = new Date();
    if (option.hours) {
      snoozeDate.setHours(snoozeDate.getHours() + option.hours);
    }
    if (option.days) {
      snoozeDate.setDate(snoozeDate.getDate() + option.days);
      snoozeDate.setHours(9, 0, 0, 0); // Set to 9 AM
    }

    setIsSaving(true);
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
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  const priorityOptions = [
    { value: "HIGH", label: "High", color: "text-red-500 bg-red-500/10" },
    {
      value: "MEDIUM",
      label: "Medium",
      color: "text-orange-500 bg-orange-500/10",
    },
    { value: "LOW", label: "Low", color: "text-blue-500 bg-blue-500/10" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold">Task Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title..."
                    className="text-base"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="size-4" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 text-sm rounded-lg",
                      "border border-border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      "resize-none"
                    )}
                  />
                </div>

                {/* Date & Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-4" />
                    Schedule
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm rounded-lg",
                        "border border-border bg-background",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      )}
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
                        className="gap-1.5"
                      >
                        <AlarmClock className="size-4" />
                        Snooze
                      </Button>

                      {/* Snooze Menu */}
                      <AnimatePresence>
                        {showSnoozeMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-10 py-1"
                          >
                            {SNOOZE_OPTIONS.map((option) => (
                              <button
                                key={option.label}
                                onClick={() => {
                                  handleSnooze(option);
                                  setShowSnoozeMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                              >
                                <option.icon className="size-4 text-muted-foreground" />
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Flag className="size-4" />
                    Priority
                  </label>
                  <div className="flex items-center gap-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPriority(opt.value)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
                          priority === opt.value
                            ? opt.color
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Flag className="size-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recurring */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Repeat className="size-4" />
                    Repeat
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                        isRecurring ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block size-4 transform rounded-full bg-white transition-transform",
                          isRecurring ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                    {isRecurring && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1"
                      >
                        {RECURRENCE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setRecurrence(opt.value)}
                            className={cn(
                              "px-2.5 py-1 rounded text-xs transition-colors",
                              recurrence === opt.value
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/30">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="size-4 mr-1.5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
