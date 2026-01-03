"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("size-9", className)}>
        <Sun className="size-4" />
      </Button>
    );
  }

  if (variant === "full") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 hover:bg-sidebar-accent/80 transition-all duration-150",
              className
            )}
          >
            {theme === "dark" ? (
              <Moon className="size-4 text-muted-foreground" />
            ) : theme === "light" ? (
              <Sun className="size-4 text-muted-foreground" />
            ) : (
              <Monitor className="size-4 text-muted-foreground" />
            )}
            <span className="text-sm text-sidebar-foreground">
              {theme === "dark"
                ? "Dark"
                : theme === "light"
                ? "Light"
                : "System"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-modal w-40">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === "light" && "bg-primary/10 text-primary"
            )}
          >
            <Sun className="size-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === "dark" && "bg-primary/10 text-primary"
            )}
          >
            <Moon className="size-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === "system" && "bg-primary/10 text-primary"
            )}
          >
            <Monitor className="size-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-9 rounded-lg hover:bg-secondary transition-colors",
            className
          )}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-modal">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "light" && "bg-primary/10 text-primary"
          )}
        >
          <Sun className="size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "dark" && "bg-primary/10 text-primary"
          )}
        >
          <Moon className="size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "system" && "bg-primary/10 text-primary"
          )}
        >
          <Monitor className="size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
