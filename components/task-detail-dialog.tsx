"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Flag,
  Repeat,
  AlarmClock,
  FileText,
  Check,
  Sunrise,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.startTime ? new Date(task.startTime) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(
    task.startTime
      ? new Date(task.startTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "09:00"
  );
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false);
  const [recurrence, setRecurrence] = useState(task.recurrence || "DAILY");
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "MEDIUM");
    setSelectedDate(task.startTime ? new Date(task.startTime) : undefined);
    setSelectedTime(
      task.startTime
        ? new Date(task.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "09:00"
    );
    setIsRecurring(task.isRecurring || false);
    setRecurrence(task.recurrence || "DAILY");
  }, [task]);

  async function handleSave() {
    setIsSaving(true);
    try {
      let finalDate: string | null = null;
      if (selectedDate) {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const date = new Date(selectedDate);
        date.setHours(hours, minutes, 0, 0);
        finalDate = date.toISOString();
      }

      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          priority,
          startTime: finalDate,
          dueDate: finalDate,
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="task-description"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              Description
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="size-4" />
              Schedule
            </Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 size-4" />
                    {selectedDate ? (
                      selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-24 justify-start gap-2"
                  >
                    <Clock className="size-4" />
                    {selectedTime}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      "06:00",
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                      "21:00",
                      "22:00",
                      "23:00",
                    ].map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "ghost"}
                        size="sm"
                        className="text-xs"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDate(undefined);
                    setSelectedTime("09:00");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <AlarmClock className="size-4" />
                    Snooze
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {SNOOZE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.label}
                      onClick={() => handleSnooze(option)}
                      className="gap-2 cursor-pointer"
                    >
                      <option.icon className="size-4" />
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag className="size-4" />
              Priority
            </Label>
            <ToggleGroup
              type="single"
              value={priority}
              onValueChange={(value) => value && setPriority(value)}
              className="justify-start"
            >
              <ToggleGroupItem
                value="HIGH"
                className="gap-1.5 px-3 data-[state=on]:text-red-500 data-[state=on]:bg-red-500/10"
              >
                <Flag className="size-3.5" />
                High
              </ToggleGroupItem>
              <ToggleGroupItem
                value="MEDIUM"
                className="gap-1.5 px-3 data-[state=on]:text-orange-500 data-[state=on]:bg-orange-500/10"
              >
                <Flag className="size-3.5" />
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem
                value="LOW"
                className="gap-1.5 px-3 data-[state=on]:text-blue-500 data-[state=on]:bg-blue-500/10"
              >
                <Flag className="size-3.5" />
                Low
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Recurring */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="size-4" />
              Repeat
            </Label>
            <div className="flex items-center gap-3">
              <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              <AnimatePresence>
                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <ToggleGroup
                      type="single"
                      value={recurrence}
                      onValueChange={(value) => value && setRecurrence(value)}
                      size="sm"
                    >
                      {RECURRENCE_OPTIONS.map((opt) => (
                        <ToggleGroupItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs px-2.5"
                        >
                          {opt.label}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
