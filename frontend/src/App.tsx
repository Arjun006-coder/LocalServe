import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import SearchPage from "./pages/Search";
import ProviderProfile from "./pages/ProviderProfile";
import BookingPage from "./pages/Booking";
import ComparisonPage from "./pages/Comparison";
import WorkerDashboard from "./pages/WorkerDashboard";
import UserDashboard from "./pages/UserDashboard";
import PostService from "./pages/PostService";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/post-service" element={<PostService />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
