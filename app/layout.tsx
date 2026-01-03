import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandBar } from "@/components/command-bar";
import { CommandBarTrigger } from "@/components/command-bar-trigger";
import { GlobalKeyboardShortcuts } from "@/components/global-keyboard-shortcuts";
import { SettingsProvider } from "@/components/settings-provider";
import { auth } from "@/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akiflow - Productivity Suite",
  description: "Your productivity command center",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SettingsProvider>
            {isLoggedIn ? (
              <SidebarProvider>
                <AppSidebar />
                <main className="flex-1 flex flex-col min-h-screen bg-background transition-colors duration-300">
                  {/* Top Bar with subtle gradient */}
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/20 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
                    <SidebarTrigger className="size-9 rounded-xl hover:bg-secondary/80 active:scale-95 transition-all duration-200" />

                    <div className="flex-1" />

                    {/* Command Bar Trigger Hint */}
                    <CommandBarTrigger />

                    {/* Theme Toggle */}
                    <ThemeToggle />
                  </div>

                  {/* Page Content with smooth transitions */}
                  <div className="flex-1 overflow-auto animate-fade-in">
                    {children}
                  </div>
                </main>
                <CommandBar />
                <GlobalKeyboardShortcuts />
              </SidebarProvider>
            ) : (
              <main className="min-h-screen bg-background">{children}</main>
            )}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
