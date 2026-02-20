import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Clock, Star, MessageCircle, Share2, ChevronRight, Shield, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import StarRating from "@/components/StarRating";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const calendarDays = ["M", "T", "W", "T", "F", "S", "S"];
const availability = [true, true, false, true, true, true, false];

export default function ProviderProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "about" | "ai">("services");

  useEffect(() => {
    async function fetchProviderData() {
      if (!id) return;

      const [pRes, sRes, rRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('services').select('*').eq('provider_id', id),
        supabase.from('reviews').select('*').eq('provider_id', id)
      ]);

      if (pRes.data) setProvider(pRes.data);
      if (sRes.data) setServices(sRes.data);
      if (rRes.data) setReviews(rRes.data);
      setLoading(false);
    }

    fetchProviderData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!provider) return <div className="min-h-screen flex items-center justify-center">Provider not found</div>;

  // Map Supabase fields to UI expectations
  const p = {
    ...provider,
    name: provider.full_name || provider.name,
    verified: provider.is_verified ?? provider.verified,
    reviews: provider.review_count ?? provider.reviews,
    price: provider.hourly_rate ?? provider.price,
    responseTime: provider.response_time ?? provider.responseTime,
    distance: provider.distance || "Unavailable", // Might need PostGIS logic later
    available: true // Default to true if not specified
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="fixed inset-0 pointer-events-none z-0 mesh-bg opacity-50" />

      {/* Hero */}
      <div className="gradient-hero-bg px-5 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-primary-foreground/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-8 w-40 h-40 rounded-full bg-accent/15 blur-2xl animate-float" style={{ animationDelay: "1s" }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6 animate-fade-up">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl glass flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={18} className="text-primary-foreground" />
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-2xl glass flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                <Share2 size={16} className="text-primary-foreground" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center animate-fade-up" style={{ animationDelay: "0.08s" }}>
            <div className="relative">
              <div
                className={cn("w-22 h-22 w-[88px] h-[88px] rounded-3xl flex items-center justify-center text-2xl font-black text-primary-foreground relative overflow-hidden", p.color)}
                style={{ boxShadow: "0 8px 32px hsl(0 0% 0% / 0.25), 0 0 0 3px hsl(0 0% 100% / 0.25)" }}
              >
                {p.initials}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
              </div>
              {p.available && <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-card animate-pulse-dot" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-primary-foreground text-xl font-black tracking-tight">{p.name}</h1>
                {p.verified && <CheckCircle2 size={18} className="text-accent" />}
              </div>
              <p className="text-primary-foreground/80 text-sm mb-2 font-medium">{p.category || "Service Provider"}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 glass rounded-full px-2.5 py-1">
                  <Star size={12} className="text-yellow-300 fill-current" />
                  <span className="text-primary-foreground text-xs font-bold">{p.rating || 0}</span>
                  <span className="text-primary-foreground/70 text-[10px]">({p.reviews || 0})</span>
                </div>
                <span className="text-primary-foreground/80 text-xs flex items-center gap-1">
                  <MapPin size={11} /> {p.distance}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 animate-fade-up" style={{ animationDelay: "0.12s" }}>
            {[
              { label: "Jobs Done", value: String(p.completed_jobs || 0) },
              { label: "Response", value: p.responseTime || "N/A" },
              { label: "Rate", value: `₹${p.price?.replace(/[^0-9.]/g, '') || "500"}` },
            ].map(({ label, value }) => (
              <div key={label} className="glass rounded-2xl p-3 text-center glass-inset">
                <p className="text-primary-foreground text-base font-black">{value}</p>
                <p className="text-primary-foreground/70 text-[11px] font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 relative z-10">
        {/* Trust badge */}
        <div className="glass-card p-4 flex items-center gap-3 animate-scale-in">
          <div className="w-10 h-10 rounded-2xl bg-accent-light flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Background Verified</p>
            <p className="text-xs text-muted-foreground">ID & license checked by LocalServe</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center">
            <CheckCircle2 size={16} className="text-accent" />
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl animate-fade-up"
          style={{
            background: "hsl(0 0% 100% / 0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {(["services", "reviews", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-xl capitalize transition-all duration-250",
                activeTab === tab
                  ? "text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
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

        {activeTab === "services" && (
          <div className="space-y-2.5 animate-fade-in">
            {services.map((s, i) => (
              <div
                key={s.name}
                className="glass-card p-4 flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock size={11} className="text-primary/60" /> {s.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-pink-500">₹{s.price?.replace(/[^0-9.]/g, '') || "0"}</p>
                  <ChevronRight size={16} className="text-muted-foreground ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3 animate-fade-in">
            <div
              className="glass-card p-5 text-center"
              style={{ background: "var(--gradient-card)" }}
            >
              <p className="text-5xl font-black text-foreground">{provider.rating}</p>
              <StarRating rating={provider.rating} count={provider.reviews} className="justify-center mt-2" size={18} />
              <p className="text-xs text-muted-foreground mt-2 font-medium">Based on {provider.reviews} reviews</p>
            </div>
            {reviews.map((r, i) => (
              <div
                key={r.name}
                className="glass-card p-4 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-2xl text-primary text-xs font-black flex items-center justify-center"
                      style={{ background: "hsl(var(--primary-light))" }}
                    >
                      {r.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-bold text-foreground">{r.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <StarRating rating={r.rating} size={12} />
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-3 animate-fade-in">
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{provider.bio}</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">This Week's Availability</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{day}</span>
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                        availability[i]
                          ? "text-accent"
                          : "text-destructive opacity-50"
                      )}
                      style={availability[i] ? {
                        background: "hsl(var(--accent-light))",
                        boxShadow: "0 2px 8px hsl(var(--accent) / 0.2)",
                      } : {
                        background: "hsl(var(--destructive) / 0.08)",
                      }}
                    >
                      {i + 19}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Book Button */}
      <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
        <button
          onClick={() => navigate(`/booking/${id}`)}
          className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2 shadow-glow animate-glow-pulse"
        >
          <Sparkles size={18} />
          Book Now · ₹{p.price?.replace(/[^0-9.]/g, '') || "500"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
