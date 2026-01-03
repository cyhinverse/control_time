"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Loader2,
  Clock,
  Flag,
  Calendar,
  Sun,
  X,
  CalendarDays,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import * as chrono from "chrono-node";

export function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Don't close if clicking inside popover content
      if (target.closest("[data-radix-popper-content-wrapper]")) {
        return;
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse natural language date from input
  useEffect(() => {
    if (title) {
      const result = chrono.parseDate(title);
      setParsedDate(result);
    } else {
      setParsedDate(null);
    }
  }, [title]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description || null,
          startTime: parsedDate?.toISOString(),
          priority: priority,
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      setTitle("");
      setDescription("");
      setParsedDate(null);
      setPriority("MEDIUM");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function setToday() {
    const today = new Date();
    today.setHours(9, 0, 0, 0);
    setParsedDate(today);
    setSelectedDate(today);
  }

  function setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setParsedDate(tomorrow);
    setSelectedDate(tomorrow);
  }

  // Auto-apply date/time when selectedDate or selectedTime changes
  useEffect(() => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const date = new Date(selectedDate);
      date.setHours(hours || 9, minutes || 0, 0, 0);
      setParsedDate(date);
    }
  }, [selectedDate, selectedTime]);

  function clearDateTime() {
    setParsedDate(null);
    setSelectedDate(undefined);
    setSelectedTime("09:00");
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
    <motion.form
      onSubmit={onSubmit}
      className="space-y-3"
      ref={containerRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Input */}
      <motion.div
        className={cn(
          "relative rounded-lg border transition-all duration-200",
          isFocused
            ? "border-primary bg-background shadow-sm shadow-primary/10"
            : "border-border bg-muted/30"
        )}
        whileFocus={{ scale: 1.01 }}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <motion.div
              animate={{ rotate: isFocused ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus
                className={cn(
                  "size-4 transition-colors",
                  isFocused ? "text-primary" : "text-muted-foreground"
                )}
              />
            </motion.div>
          )}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Add a task... Try 'Meeting tomorrow at 9am'"
          disabled={isLoading}
          className="pl-9 pr-4 py-5 text-sm bg-transparent border-0 focus-visible:ring-0"
        />

        {/* Parsed Date Badge */}
        <AnimatePresence>
          {parsedDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
            >
              <span className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                <Clock className="size-3" />
                {formatParsedDate(parsedDate)}
              </span>
              <button
                type="button"
                onClick={clearDateTime}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit hint */}
        <AnimatePresence>
          {title.length > 0 && !parsedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <kbd className="kbd text-[10px]">Enter</kbd>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions - Only show when focused or has content */}
      <AnimatePresence>
        {(isFocused || title.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 px-1 overflow-hidden"
          >
            <motion.button
              type="button"
              onClick={setToday}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors"
              )}
            >
              <Sun className="size-3" />
              Today
            </motion.button>
            <motion.button
              type="button"
              onClick={setTomorrow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors"
              )}
            >
              <Calendar className="size-3" />
              Tomorrow
            </motion.button>

            {/* Custom Date/Time Picker - Popover */}
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                    "transition-colors",
                    showDatePicker || selectedDate
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <CalendarDays className="size-3" />
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Pick date"}
                </motion.button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      setShowDatePicker(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Time Picker - Separate Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                    "transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Clock className="size-3" />
                  {selectedTime}
                </motion.button>
              </PopoverTrigger>
              <PopoverContent
                className="w-48 p-2"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                    ].map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "ghost"}
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="text"
                    placeholder="HH:MM"
                    value={selectedTime}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) ||
                        val.length <= 5
                      ) {
                        setSelectedTime(val);
                      }
                    }}
                    className="text-xs h-8"
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear Date Button */}
            {selectedDate && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setSelectedDate(undefined);
                  setParsedDate(null);
                }}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-3" />
              </motion.button>
            )}

            <div className="h-4 w-px bg-border mx-1" />

            {/* Priority Toggle Group */}
            <ToggleGroup
              type="single"
              value={priority}
              onValueChange={(value) => value && setPriority(value)}
              className="gap-0.5"
            >
              <ToggleGroupItem
                value="HIGH"
                size="sm"
                className="gap-1 text-xs h-7 px-2 data-[state=on]:text-red-500 data-[state=on]:bg-red-500/10"
              >
                <Flag className="size-3" />
                High
              </ToggleGroupItem>
              <ToggleGroupItem
                value="MEDIUM"
                size="sm"
                className="gap-1 text-xs h-7 px-2 data-[state=on]:text-orange-500 data-[state=on]:bg-orange-500/10"
              >
                <Flag className="size-3" />
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem
                value="LOW"
                size="sm"
                className="gap-1 text-xs h-7 px-2 data-[state=on]:text-blue-500 data-[state=on]:bg-blue-500/10"
              >
                <Flag className="size-3" />
                Low
              </ToggleGroupItem>
            </ToggleGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
