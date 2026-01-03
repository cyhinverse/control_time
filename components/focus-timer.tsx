"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Target,
  Volume2,
  VolumeX,
  Settings,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FocusTimerProps {
  taskTitle?: string;
  onComplete?: () => void;
}

type TimerMode = "focus" | "shortBreak" | "longBreak";

const TIMER_SETTINGS = {
  focus: { duration: 25 * 60, label: "Focus", color: "text-primary" },
  shortBreak: {
    duration: 5 * 60,
    label: "Short Break",
    color: "text-green-500",
  },
  longBreak: { duration: 15 * 60, label: "Long Break", color: "text-blue-500" },
};

export function FocusTimer({ taskTitle, onComplete }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [customDurations, setCustomDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const playSound = useCallback(() => {
    if (soundEnabled) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    }
  }, [soundEnabled]);

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode);
      setIsRunning(false);
      const duration =
        newMode === "focus"
          ? customDurations.focus * 60
          : newMode === "shortBreak"
          ? customDurations.shortBreak * 60
          : customDurations.longBreak * 60;
      setTimeLeft(duration);
    },
    [customDurations]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      playSound();
      setIsRunning(false);

      if (mode === "focus") {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        onComplete?.();

        // After 4 focus sessions, take a long break
        if (newSessions % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("focus");
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessions, switchMode, playSound, onComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    const duration =
      mode === "focus"
        ? customDurations.focus * 60
        : mode === "shortBreak"
        ? customDurations.shortBreak * 60
        : customDurations.longBreak * 60;
    setTimeLeft(duration);
  };

  const progress =
    1 -
    timeLeft /
      (mode === "focus"
        ? customDurations.focus * 60
        : mode === "shortBreak"
        ? customDurations.shortBreak * 60
        : customDurations.longBreak * 60);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      {/* Mode Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg mb-6">
        {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              mode === m
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "focus" ? (
              <span className="flex items-center gap-1.5">
                <Target className="size-4" />
                Focus
              </span>
            ) : m === "shortBreak" ? (
              <span className="flex items-center gap-1.5">
                <Coffee className="size-4" />
                Short
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Coffee className="size-4" />
                Long
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative mb-6">
        <svg className="size-64 -rotate-90" viewBox="0 0 256 256">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={TIMER_SETTINGS[mode].color}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-5xl font-mono font-bold tracking-tight"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className={cn("text-sm mt-1", TIMER_SETTINGS[mode].color)}>
            {TIMER_SETTINGS[mode].label}
          </span>
          {taskTitle && (
            <span className="text-xs text-muted-foreground mt-2 max-w-[180px] truncate">
              {taskTitle}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="size-12 rounded-full"
        >
          <RotateCcw className="size-5" />
        </Button>

        <Button
          size="icon"
          onClick={toggleTimer}
          className={cn(
            "size-16 rounded-full transition-colors",
            isRunning ? "bg-orange-500 hover:bg-orange-600" : ""
          )}
        >
          {isRunning ? (
            <Pause className="size-7" />
          ) : (
            <Play className="size-7 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="size-12 rounded-full"
        >
          {soundEnabled ? (
            <Volume2 className="size-5" />
          ) : (
            <VolumeX className="size-5" />
          )}
        </Button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "size-3 rounded-full transition-colors",
              i <= sessions % 4 ||
                (sessions % 4 === 0 && sessions > 0 && i === 4)
                ? "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {sessions} sessions completed
        </span>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings className="size-4" />
        Settings
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden w-full mt-4"
          >
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Focus Duration</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customDurations.focus}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        focus: Number(e.target.value),
                      }))
                    }
                    min={1}
                    max={60}
                    className="w-16 px-2 py-1 text-sm rounded border border-border bg-background text-center"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Short Break</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customDurations.shortBreak}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        shortBreak: Number(e.target.value),
                      }))
                    }
                    min={1}
                    max={30}
                    className="w-16 px-2 py-1 text-sm rounded border border-border bg-background text-center"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Long Break</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customDurations.longBreak}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        longBreak: Number(e.target.value),
                      }))
                    }
                    min={1}
                    max={60}
                    className="w-16 px-2 py-1 text-sm rounded border border-border bg-background text-center"
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  resetTimer();
                  setShowSettings(false);
                }}
                className="w-full mt-2"
              >
                <Check className="size-4 mr-1.5" />
                Apply
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
