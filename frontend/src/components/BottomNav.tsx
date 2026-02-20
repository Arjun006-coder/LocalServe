import { Home, Search, User, Calendar, BarChart2, PlusCircle, LayoutDashboard } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setRole(data?.role || null));
    }
  }, [user]);

  const commonItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/search" },
  ];

  if (!user) {
    const guestItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: User, label: "Log In", path: "/auth" },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0e1116]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50">
        {guestItems.map(({ icon: Icon, label, path }, i) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-1 text-white/40 hover:text-pink-500 transition-colors",
              location.pathname === path && "text-pink-500"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
          </button>
        ))}
      </nav>
    );
  }

  const roleItems = role === 'provider'
    ? [
      { icon: PlusCircle, label: "Post", path: "/post-service" },
      { icon: LayoutDashboard, label: "Stats", path: "/worker-dashboard" },
    ]
    : [
      { icon: Calendar, label: "Bookings", path: "/user-dashboard" },
    ];

  const navItems = [...commonItems, ...roleItems, { icon: User, label: "Account", path: "/auth" }];

  return (
    <nav className="bottom-nav z-50">
      <div className="flex items-center justify-around px-2 py-2 pb-safe-bottom">
        {navItems.map(({ icon: Icon, label, path }, i) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  active
                    ? "text-primary"
                    : "hover:bg-muted"
                )}
                style={active ? {
                  background: "hsl(var(--primary-light))",
                  boxShadow: "0 2px 12px hsl(var(--primary) / 0.2)",
                } : {}}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={cn("transition-transform duration-300", active && "scale-110")}
                />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                active && "font-bold text-primary"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
