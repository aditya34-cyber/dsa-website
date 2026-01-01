import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SortingVisualization from "./pages/SortingVisualization";
import SearchingVisualization from "./pages/SearchingVisualization";
import StackVisualization from "./pages/StackVisualization";
import QueueVisualization from "./pages/QueueVisualization";
import CodingPractice from "./pages/CodingPractice";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sorting" element={<SortingVisualization />} />
          <Route path="/searching" element={<SearchingVisualization />} />
          <Route path="/stacks" element={<StackVisualization />} />
          <Route path="/queues" element={<QueueVisualization />} />
          <Route path="/coding-practice" element={<CodingPractice />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
