import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AuthStateObserver } from "./components/AuthStateObserver";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
          <AuthStateObserver />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/provider/:id" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />
            <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
            <Route path="/worker-dashboard" element={<ProtectedRoute><WorkerDashboard /></ProtectedRoute>} />
            <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/post-service" element={<ProtectedRoute><PostService /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
