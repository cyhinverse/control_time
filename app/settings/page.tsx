"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Settings,
  Bell,
  Palette,
  Clock,
  Globe,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";
import { playCompletionSound, defaultSettings } from "@/lib/settings";

// Toggle Switch Component
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform shadow-sm",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

// Setting Item Component
function SettingItem({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Export settings to JSON file
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "control-time-settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import settings from JSON file
  const importSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const imported = JSON.parse(text);
          Object.keys(imported).forEach((key) => {
            if (key in settings) {
              updateSetting(key as keyof typeof settings, imported[key]);
            }
          });
        } catch {
          alert("Invalid settings file");
        }
      }
    };
    input.click();
  };

  // Reset all settings to default
  const resetSettings = () => {
    if (confirm("Reset all settings to default? This cannot be undone.")) {
      Object.keys(defaultSettings).forEach((key) => {
        updateSetting(
          key as keyof typeof settings,
          defaultSettings[key as keyof typeof defaultSettings]
        );
      });
    }
  };

  if (!mounted) return null;

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="h-full flex flex-col px-6 py-4 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Settings className="size-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl pb-8">
        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Palette className="size-4 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-xs">
              Customize the look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors",
                      theme === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <opt.icon
                      className={cn(
                        "size-4",
                        theme === opt.value
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        theme === opt.value
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-1">
              <SettingItem
                title="Compact mode"
                description="Reduce spacing and padding"
              >
                <Toggle
                  checked={settings.compactMode}
                  onChange={(v) => updateSetting("compactMode", v)}
                />
              </SettingItem>
              <SettingItem
                title="Show keyboard hints"
                description="Display shortcut reminders"
              >
                <Toggle
                  checked={settings.showKeyboardHints}
                  onChange={(v) => updateSetting("showKeyboardHints", v)}
                />
              </SettingItem>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bell className="size-4 text-orange-500" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingItem
              title="Push notifications"
              description="Get notified about task reminders"
            >
              <Toggle
                checked={settings.pushNotifications}
                onChange={(v) => updateSetting("pushNotifications", v)}
              />
            </SettingItem>
            <SettingItem
              title="Email digest"
              description="Daily summary of your tasks"
            >
              <Toggle
                checked={settings.emailDigest}
                onChange={(v) => updateSetting("emailDigest", v)}
              />
            </SettingItem>
            <SettingItem
              title="Sound effects"
              description="Play sound on task completion"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={playCompletionSound}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Test sound"
                >
                  <Volume2 className="size-4" />
                </button>
                <Toggle
                  checked={settings.soundEffects}
                  onChange={(v) => updateSetting("soundEffects", v)}
                />
              </div>
            </SettingItem>
          </CardContent>
        </Card>

        {/* Time & Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-blue-500" />
              Time & Calendar
            </CardTitle>
            <CardDescription className="text-xs">
              Configure your time preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Default task duration
              </label>
              <select
                value={settings.defaultDuration}
                onChange={(e) =>
                  updateSetting("defaultDuration", e.target.value)
                }
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Week starts on</label>
              <select
                value={settings.weekStart}
                onChange={(e) => updateSetting("weekStart", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Time format</label>
              <select
                value={settings.timeFormat}
                onChange={(e) => updateSetting("timeFormat", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="12h">12-hour (AM/PM)</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Globe className="size-4 text-green-500" />
              Language & Region
            </CardTitle>
            <CardDescription className="text-xs">
              Set your language and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting("timezone", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="GMT+7">(GMT+7) Ho Chi Minh City</option>
                <option value="GMT+8">(GMT+8) Singapore</option>
                <option value="GMT+9">(GMT+9) Tokyo</option>
                <option value="GMT-8">(GMT-8) Los Angeles</option>
                <option value="GMT-5">(GMT-5) New York</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSetting("dateFormat", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="size-4 text-purple-500" />
              Data Management
            </CardTitle>
            <CardDescription className="text-xs">
              Export, import, or reset your settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSettings}
                className="gap-2"
              >
                <Download className="size-4" />
                Export Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={importSettings}
                className="gap-2"
              >
                <Upload className="size-4" />
                Import Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
