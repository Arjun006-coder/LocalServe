import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

/**
 * AuthStateObserver
 * This component listens for Supabase auth state changes globally.
 * It ensures that when a user signs out, they are redirected to the landing page,
 * no matter which tab or page they are on.
 */
export const AuthStateObserver = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                // Force redirect to landing page on logout
                navigate("/", { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return null; // This component doesn't render anything
};
