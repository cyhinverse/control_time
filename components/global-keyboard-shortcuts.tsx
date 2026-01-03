"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyboardShortcuts } from "./keyboard-shortcuts";

export function GlobalKeyboardShortcuts() {
  const router = useRouter();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // ⌘ + / to show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // G + key navigation
      if (e.key.toLowerCase() === "g" && !gPressed) {
        gPressed = true;
        gTimeout = setTimeout(() => {
          gPressed = false;
        }, 500);
        return;
      }

      if (gPressed) {
        gPressed = false;
        clearTimeout(gTimeout);

        switch (e.key.toLowerCase()) {
          case "i":
            e.preventDefault();
            router.push("/");
            break;
          case "c":
            e.preventDefault();
            router.push("/calendar");
            break;
          case "r":
            e.preventDefault();
            router.push("/rituals");
            break;
          case "f":
            e.preventDefault();
            router.push("/focus");
            break;
          case "s":
            e.preventDefault();
            router.push("/stats");
            break;
          case "l":
            e.preventDefault();
            router.push("/labels");
            break;
        }
      }

      // N for new task - focus on input
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey) {
        const input = document.querySelector(
          'input[placeholder*="Add a task"]'
        ) as HTMLInputElement;
        if (input) {
          e.preventDefault();
          input.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <KeyboardShortcuts
      open={showShortcuts}
      onClose={() => setShowShortcuts(false)}
    />
  );
}
