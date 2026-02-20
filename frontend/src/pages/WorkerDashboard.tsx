import { useEffect, useState } from "react";
import { Bell, ToggleLeft, ToggleRight, TrendingUp, Calendar, DollarSign, CheckCircle2, Clock, Star, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"bookings" | "earnings" | "notifications">("bookings");

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:profiles!customer_id(*)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingsData) setBookings(bookingsData);

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setUnreadCount(count || 0);
      setLoading(false);
    }

    fetchDashboardData();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!profile) return;
    const newStatus = !profile.is_available;

    setProfile({ ...profile, is_available: newStatus });

    const { error } = await supabase
      .from('profiles')
      .update({ is_available: newStatus })
      .eq('id', user?.id);

    if (error) {
      toast.error("Failed to update status");
      setProfile({ ...profile, is_available: !newStatus });
    } else {
      toast.success(newStatus ? "You are now online!" : "You are now offline");
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);

      // Notify customer
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        await supabase.from('notifications').insert({
          user_id: booking.customer_id,
          title: `Booking ${status.toUpperCase()}`,
          content: `Your booking for ${profile?.full_name} has been ${status}.`,
          type: `booking_${status}`
        });
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, b) => acc + parseFloat((b.total_price || "0").replace(/[^0-9.]/g, '')), 0);

  const completedCount = bookings.filter((b) => b.status === "completed").length;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="fixed inset-0 pointer-events-none z-0 mesh-bg opacity-50" />

      {/* Header */}
      <div className="gradient-hero-bg px-5 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-primary-foreground/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-accent/15 blur-2xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Sparkles size={13} className="text-accent" />
                <p className="text-primary-foreground/75 text-sm font-medium">Worker Dashboard</p>
              </div>
              <h1 className="text-primary-foreground text-2xl font-black tracking-tight">{profile?.full_name || "Service Provider"}</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => navigate("/notifications")}
                className="w-11 h-11 rounded-2xl glass flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <Bell size={20} className="text-primary-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent border-2 border-primary flex items-center justify-center text-[10px] font-black text-accent-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Availability Toggle */}
          <button
            onClick={handleToggleAvailability}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border transition-all duration-300 animate-fade-up glass-inset"
            style={profile?.is_available ? {
              background: "hsl(158 68% 42% / 0.2)",
              borderColor: "hsl(158 68% 42% / 0.5)",
            } : {
              background: "hsl(0 0% 100% / 0.1)",
              borderColor: "hsl(0 0% 100% / 0.2)",
            }}
          >
            {profile?.is_available ? (
              <ToggleRight size={28} className="text-accent flex-shrink-0" />
            ) : (
              <ToggleLeft size={28} className="text-primary-foreground/50 flex-shrink-0" />
            )}
            <div className="text-left flex-1">
              <p className="text-primary-foreground text-sm font-bold">
                {profile?.is_available ? "Available for Bookings" : "Unavailable"}
              </p>
              <p className="text-primary-foreground/70 text-xs font-medium">
                {profile?.is_available ? "Clients can book you now" : "Toggle to go online"}
              </p>
            </div>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: profile?.is_available ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
            />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 relative z-10 animate-slide-up">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: DollarSign, color: "text-pink-500", bg: "hsl(340 100% 50% / 0.1)" },
            { label: "Completed", value: String(completedCount), icon: CheckCircle2, color: "text-emerald-500", bg: "hsl(158 68% 42% / 0.1)" },
            { label: "Rating", value: `${profile?.rating || 0}★`, icon: Star, color: "text-yellow-500", bg: "hsl(45 100% 50% / 0.1)" },
          ].map(({ label, value, icon: Icon, color, bg }, i) => (
            <div
              key={label}
              className="glass-card p-3 text-center animate-scale-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon size={15} className={color} />
              </div>
              <p className="text-base font-black text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{
            background: "hsl(0 0% 100% / 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {(["bookings", "earnings", "notifications"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-bold rounded-xl capitalize transition-all duration-250 relative",
                activeTab !== tab && "text-muted-foreground hover:text-foreground"
              )}
              style={activeTab === tab ? {
                background: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 4px 16px hsl(var(--primary) / 0.35)",
              } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "bookings" && (
          <div className="space-y-2.5 animate-fade-in">
            {bookings.length === 0 ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                No bookings yet.
              </div>
            ) : bookings.map((b, i) => (
              <div
                key={b.id}
                className="glass-card p-4 flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div
                  className="w-2 h-12 rounded-full flex-shrink-0"
                  style={{
                    background: b.status === "pending"
                      ? "hsl(var(--primary))"
                      : b.status === "completed"
                        ? "hsl(var(--accent))"
                        : "hsl(var(--destructive))",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-foreground truncate">{b.customer?.full_name || "Client"}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                      style={b.status === "pending" ? {
                        background: "hsl(var(--primary-light))",
                        color: "hsl(var(--primary))",
                      } : b.status === "confirmed" ? {
                        background: "hsl(158 68% 42% / 0.15)",
                        color: "hsl(158 68% 42%)",
                      } : b.status === "completed" ? {
                        background: "hsl(var(--accent-light))",
                        color: "hsl(var(--accent))",
                      } : {
                        background: "hsl(var(--destructive) / 0.1)",
                        color: "hsl(var(--destructive))",
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock size={10} /> {new Date(b.scheduled_at).toLocaleDateString()}
                  </p>

                  {b.status === 'pending' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="text-[10px] font-bold text-emerald-500 hover:underline">Accept</button>
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled')} className="text-[10px] font-bold text-rose-500 hover:underline">Decline</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => updateBookingStatus(b.id, 'completed')} className="mt-2 text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                      <CheckCircle2 size={12} /> Mark Finished
                    </button>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black text-foreground">₹{b.total_price?.replace(/[^0-9.]/g, '') || "0"}</p>
                  <ChevronRight size={15} className="text-muted-foreground ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  );
}
