import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, profile, loading, needsOnboarding } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0e1116] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // 1. If not logged in, send to auth
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // 2. If logged in but hasn't picked a role, FORCE onboarding
    // The only exception is if we are already on the /auth page (which handles onboarding)
    if (needsOnboarding && location.pathname !== "/auth") {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};
