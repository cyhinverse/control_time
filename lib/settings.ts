// Settings utility functions and types

export interface AppSettings {
  pushNotifications: boolean;
  emailDigest: boolean;
  soundEffects: boolean;
  defaultDuration: string;
  weekStart: "sunday" | "monday";
  timeFormat: "12h" | "24h";
  language: string;
  timezone: string;
  dateFormat: string;
  compactMode: boolean;
  showKeyboardHints: boolean;
}

export const defaultSettings: AppSettings = {
  pushNotifications: true,
  emailDigest: false,
  soundEffects: true,
  defaultDuration: "60",
  weekStart: "monday",
  timeFormat: "12h",
  language: "en",
  timezone: "GMT+7",
  dateFormat: "DD/MM/YYYY",
  compactMode: false,
  showKeyboardHints: true,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;

  const saved = localStorage.getItem("app-settings");
  if (saved) {
    try {
      return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export function updateSettings(newSettings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  localStorage.setItem("app-settings", JSON.stringify(updated));

  // Dispatch event for other components to react
  window.dispatchEvent(
    new CustomEvent("settings-changed", { detail: updated })
  );

  return updated;
}

// Sound effect for task completion
export function playCompletionSound() {
  const settings = getSettings();
  if (!settings.soundEffects) return;

  // Create a simple completion sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    // Create a pleasant completion sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log("Audio not supported");
  }
}

// Format time based on settings
export function formatTime(date: Date, settings?: AppSettings): string {
  const s = settings || getSettings();

  if (s.timeFormat === "24h") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Format date based on settings
export function formatDate(date: Date, settings?: AppSettings): string {
  const s = settings || getSettings();

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  switch (s.dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
}

// Get week start day (0 = Sunday, 1 = Monday)
export function getWeekStartDay(settings?: AppSettings): 0 | 1 {
  const s = settings || getSettings();
  return s.weekStart === "sunday" ? 0 : 1;
}
