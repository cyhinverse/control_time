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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  }

  function setTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setParsedDate(tomorrow);
  }

  function applyCustomDateTime() {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const date = new Date(selectedDate);
      date.setHours(hours, minutes, 0, 0);
      setParsedDate(date);
      setShowDatePicker(false);
    }
  }

  function clearDateTime() {
    setParsedDate(null);
    setSelectedDate("");
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

            {/* Custom Date/Time Picker */}
            <motion.button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                "transition-colors",
                showDatePicker
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <CalendarDays className="size-3" />
              Pick date
            </motion.button>

            <div className="h-4 w-px bg-border mx-1" />

            {priorityOptions.map((opt, index) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => setPriority(opt.value)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs",
                  "transition-colors",
                  priority === opt.value
                    ? opt.color
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Flag className="size-3" />
                {opt.label}
              </motion.button>
            ))}

            <div className="flex-1" />

            <span className="text-[10px] text-muted-foreground">
              Supports natural language
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date/Time Picker Panel */}
      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-3 py-2.5 bg-muted/30 rounded-lg border border-border overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Time:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="text-xs px-2 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <motion.button
              type="button"
              onClick={applyCustomDateTime}
              disabled={!selectedDate}
              whileHover={{ scale: selectedDate ? 1.05 : 1 }}
              whileTap={{ scale: selectedDate ? 0.95 : 1 }}
              className={cn(
                "text-xs px-3 py-1.5 rounded font-medium transition-colors",
                selectedDate
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Apply
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowDatePicker(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Cancel
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
