"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Inbox,
  Settings,
  User2,
  Zap,
  Timer,
  BarChart3,
  Tags,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Inbox", url: "/", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Rituals", url: "/rituals", icon: Zap },
  { title: "Focus", url: "/focus", icon: Timer },
  { title: "Stats", url: "/stats", icon: BarChart3 },
  { title: "Labels", url: "/labels", icon: Tags },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Header */}
      <SidebarHeader className={cn("p-3", isCollapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Zap className="size-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm truncate">
                Control Time
              </span>
              <span className="text-xs text-muted-foreground">
                Productivity
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {!isCollapsed && <SidebarSeparator className="mx-3" />}

      {/* Main Navigation */}
      <SidebarContent
        className={cn("py-2 flex-none", isCollapsed ? "px-1" : "px-2")}
      >
        <SidebarGroup>
          {!isCollapsed && (
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Workspace
            </div>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "h-9 rounded-lg transition-colors",
                        isCollapsed && "justify-center px-0",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center",
                          isCollapsed ? "justify-center" : "gap-3 px-3"
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {!isCollapsed && (
                          <span className="text-sm">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {!isCollapsed && <SidebarSeparator className="mx-3" />}

      {/* Footer */}
      <SidebarFooter className={cn("p-2", isCollapsed && "px-1")}>
        <SidebarMenu className="space-y-1">
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <div className={cn(isCollapsed ? "flex justify-center" : "px-1")}>
              <ThemeToggle
                variant={isCollapsed ? "icon" : "full"}
                className={cn(isCollapsed ? "size-9" : "w-full h-9 rounded-lg")}
              />
            </div>
          </SidebarMenuItem>

          {/* Profile */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Profile"
              className={cn(
                "h-9 rounded-lg transition-colors",
                isCollapsed && "justify-center px-0",
                pathname === "/profile"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Link
                href="/profile"
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                )}
              >
                <User2 className="size-4 shrink-0" />
                {!isCollapsed && <span className="text-sm">Profile</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className={cn(
                "h-9 rounded-lg transition-colors",
                isCollapsed && "justify-center px-0",
                pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Link
                href="/settings"
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3 px-3"
                )}
              >
                <Settings className="size-4 shrink-0" />
                {!isCollapsed && <span className="text-sm">Settings</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Keyboard Shortcut Hint */}
        {!isCollapsed && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-muted/50">
            <p className="text-[10px] text-muted-foreground">
              Press <kbd className="kbd mx-0.5">⌘</kbd>
              <kbd className="kbd">K</kbd> for quick actions
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
