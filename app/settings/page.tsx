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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";
import { playCompletionSound, defaultSettings } from "@/lib/settings";

// Setting Item Component
function SettingItem({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {title}
        </Label>
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
    Object.keys(defaultSettings).forEach((key) => {
      updateSetting(
        key as keyof typeof settings,
        defaultSettings[key as keyof typeof defaultSettings]
      );
    });
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
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(value) => value && setTheme(value)}
                className="grid grid-cols-3 gap-2"
              >
                {themeOptions.map((opt) => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 h-auto rounded-lg border",
                      "data-[state=on]:border-primary data-[state=on]:bg-primary/5",
                      "data-[state=off]:border-border"
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
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="border-t border-border pt-4 space-y-1">
              <SettingItem
                id="compact-mode"
                title="Compact mode"
                description="Reduce spacing and padding"
              >
                <Switch
                  id="compact-mode"
                  checked={settings.compactMode}
                  onCheckedChange={(v) => updateSetting("compactMode", v)}
                />
              </SettingItem>
              <SettingItem
                id="keyboard-hints"
                title="Show keyboard hints"
                description="Display shortcut reminders"
              >
                <Switch
                  id="keyboard-hints"
                  checked={settings.showKeyboardHints}
                  onCheckedChange={(v) => updateSetting("showKeyboardHints", v)}
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
              id="push-notifications"
              title="Push notifications"
              description="Get notified about task reminders"
            >
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(v) => updateSetting("pushNotifications", v)}
              />
            </SettingItem>
            <SettingItem
              id="email-digest"
              title="Email digest"
              description="Daily summary of your tasks"
            >
              <Switch
                id="email-digest"
                checked={settings.emailDigest}
                onCheckedChange={(v) => updateSetting("emailDigest", v)}
              />
            </SettingItem>
            <SettingItem
              id="sound-effects"
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
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(v) => updateSetting("soundEffects", v)}
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
              <Select
                value={settings.defaultDuration}
                onValueChange={(value) =>
                  updateSetting("defaultDuration", value)
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Week starts on</label>
              <Select
                value={settings.weekStart}
                onValueChange={(value) =>
                  updateSetting("weekStart", value as "sunday" | "monday")
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Time format</label>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) =>
                  updateSetting("timeFormat", value as "12h" | "24h")
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
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
              <Select
                value={settings.language}
                onValueChange={(value) => updateSetting("language", value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSetting("timezone", value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT+7">
                    (GMT+7) Ho Chi Minh City
                  </SelectItem>
                  <SelectItem value="GMT+8">(GMT+8) Singapore</SelectItem>
                  <SelectItem value="GMT+9">(GMT+9) Tokyo</SelectItem>
                  <SelectItem value="GMT-8">(GMT-8) Los Angeles</SelectItem>
                  <SelectItem value="GMT-5">(GMT-5) New York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date format</label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => updateSetting("dateFormat", value)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Reset to Default
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset all settings to default?
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resetSettings}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
