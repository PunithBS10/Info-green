import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import GlobalOverview from "@/pages/global-overview";
import Countries from "@/pages/countries";
import Settings from "@/pages/settings";
import DebugData from "@/pages/debug-data";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DebugData} />
      <Route path="/global" component={GlobalOverview} />
      <Route path="/countries" component={Countries} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="renewable-dashboard-theme">
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden bg-secondary dark:bg-background">
            <Sidebar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
