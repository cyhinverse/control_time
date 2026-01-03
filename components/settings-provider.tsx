"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AppSettings,
  defaultSettings,
  getSettings,
  updateSettings as saveSettings,
} from "@/lib/settings";

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  isCompact: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSettings(getSettings());

    // Listen for settings changes from other components
    const handleSettingsChange = (e: CustomEvent<AppSettings>) => {
      setSettings(e.detail);
    };

    window.addEventListener(
      "settings-changed",
      handleSettingsChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "settings-changed",
        handleSettingsChange as EventListener
      );
    };
  }, []);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = saveSettings({ [key]: value });
    setSettings(newSettings);
  };

  // Apply compact mode class to body
  useEffect(() => {
    if (mounted) {
      document.body.classList.toggle("compact-mode", settings.compactMode);
    }
  }, [settings.compactMode, mounted]);

  if (!mounted) {
    // Still provide context but with default values during SSR
    return (
      <SettingsContext.Provider
        value={{
          settings: defaultSettings,
          updateSetting: () => {},
          isCompact: defaultSettings.compactMode,
        }}
      >
        {children}
      </SettingsContext.Provider>
    );
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        isCompact: settings.compactMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
