import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { DashboardLayout } from "./components/app/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ResumeBuilder from "./pages/dashboard/ResumeBuilder";
import Templates from "./pages/dashboard/Templates";
import ResumeScore from "./pages/dashboard/ResumeScore";
import ExportResume from "./pages/dashboard/ExportResume";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PromptPage from "./pages/Prompt";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            {/* Public landing page */}
            <Route path="/" element={<Index />} />

            {/* Main app */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/create" element={<ResumeBuilder />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/score" element={<ResumeScore />} />
              <Route path="/export" element={<ExportResume />} />
              <Route path="/prompt" element={<PromptPage />} />
            </Route>

            {/* Backwards-compat */}
            <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
