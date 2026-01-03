"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Command,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: "General",
    items: [
      { keys: ["⌘", "K"], description: "Open command bar" },
      { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close dialogs" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { keys: ["G", "I"], description: "Go to Inbox" },
      { keys: ["G", "C"], description: "Go to Calendar" },
      { keys: ["G", "R"], description: "Go to Rituals" },
      { keys: ["G", "F"], description: "Go to Focus" },
      { keys: ["G", "S"], description: "Go to Stats" },
      { keys: ["G", "L"], description: "Go to Labels" },
    ],
  },
  {
    category: "Tasks",
    items: [
      { keys: ["N"], description: "New task" },
      { keys: ["Enter"], description: "Create task / Save edit" },
      { keys: ["E"], description: "Edit selected task" },
      { keys: ["D"], description: "Delete selected task" },
      { keys: ["T"], description: "Set due date to today" },
      { keys: ["M"], description: "Set due date to tomorrow" },
      { keys: ["1"], description: "Set high priority" },
      { keys: ["2"], description: "Set medium priority" },
      { keys: ["3"], description: "Set low priority" },
    ],
  },
  {
    category: "Calendar",
    items: [
      { keys: ["←"], description: "Previous day/week" },
      { keys: ["→"], description: "Next day/week" },
      { keys: ["Today"], description: "Go to today" },
      { keys: ["W"], description: "Week view" },
      { keys: ["D"], description: "Day view" },
    ],
  },
];

export function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-auto"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                {shortcuts.map((section) => (
                  <div key={section.category} className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-1.5"
                        >
                          <span className="text-sm">{item.description}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, keyIndex) => (
                              <kbd
                                key={keyIndex}
                                className={cn(
                                  "px-2 py-1 text-xs font-medium rounded",
                                  "bg-muted border border-border",
                                  "min-w-[24px] text-center"
                                )}
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="kbd text-[10px]">⌘</kbd> +{" "}
                  <kbd className="kbd text-[10px]">/</kbd> anytime to show this
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
