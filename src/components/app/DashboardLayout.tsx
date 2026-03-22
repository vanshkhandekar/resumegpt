import { Outlet, Link } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app/AppSidebar";
import { FloatingAiAssistant } from "@/components/ai/FloatingAiAssistant";
import { ModeToggle } from "@/components/theme/ModeToggle";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="relative flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <Link to="/" className="flex items-center gap-2 hover:opacity-80">
              <img src="/logo.png" alt="Resume GPT" className="h-8 w-auto" />
              <span className="text-lg font-bold text-foreground hidden sm:inline-block">Resume GPT</span>
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">- AI Resume Builder</span>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>

          <main className="flex-1 p-6 bg-background">
            <Outlet />
          </main>
        </div>

        {/* AI assistant (only inside dashboard) */}
        <FloatingAiAssistant context="Resume building" enabled />
      </div>
    </SidebarProvider>
  );
}
