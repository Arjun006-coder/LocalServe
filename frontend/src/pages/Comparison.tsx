import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Star, BarChart2, Scale, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import StarRating from "@/components/StarRating";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const compareFields = [
  { label: "Rating", key: "rating" as const },
  { label: "Reviews", key: "reviews" as const },
  { label: "Price", key: "price" as const },
  { label: "Location", key: "city" as const },
];

export default function ComparisonPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider');

      if (!error && data) {
        const mapped = data.map(p => ({
          id: p.id,
          name: p.full_name || "Expert Provider",
          category: p.occupation || "Professional",
          rating: 4.8, // Default for now
          reviews: Math.floor(Math.random() * 200) + 50, // Simulated reviews
          price: "₹800/hr", // Base price simulation
          city: p.city || "Gurugram",
          initials: (p.full_name || "EP")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          color: "bg-pink-600",
          available: true,
          verified: true
        }));
        setProviders(mapped);
        if (mapped.length >= 2) {
          setSelectedIds([mapped[0].id, mapped[1].id]);
        }
      }
      setLoading(false);
    }
    fetchProviders();
  }, []);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
  };

  const selected = providers.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="gradient-hero-bg px-5 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-5">
          <ArrowLeft size={18} className="text-primary-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Scale size={22} className="text-primary-foreground" />
          <h1 className="text-primary-foreground text-xl font-bold">Compare Providers</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm mt-1">Select up to 3 providers</p>
      </div>

      <div className="px-4 -mt-3 space-y-4 animate-slide-up">
        {/* Provider Selector */}
        <div className="card-base p-6 bg-white/5 border-white/5 backdrop-blur-xl">
          <h3 className="text-sm font-black text-foreground mb-4 uppercase tracking-widest opacity-60">Choose Real Experts</h3>
          {loading ? (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Loader2 className="animate-spin" size={16} />
              <span>Fetching live providers...</span>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {providers.map((p) => {
                const active = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all",
                      active ? "border-pink-500 bg-pink-500/10 text-pink-500 shadow-lg shadow-pink-500/10" : "border-white/5 bg-white/5 text-white/60 hover:border-white/20"
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white", p.color)}>
                      {p.initials[0]}
                    </div>
                    {p.name.split(" ")[0]}
                    {active && <CheckCircle2 size={16} className="text-pink-500" />}
                  </button>
                );
              })}
              {providers.length === 0 && (
                <p className="text-xs text-white/40 italic">No providers available in your area yet.</p>
              )}
            </div>
          )}
        </div>

        {selected.length >= 2 && (
          <>
            {/* Side-by-side headers */}
            <div className="card-base p-4">
              <div className={cn("grid gap-3", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {selected.map((p) => (
                  <div key={p.id} className="text-center">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-primary-foreground mx-auto mb-2", p.color)}>
                      {p.initials}
                    </div>
                    <p className="text-xs font-bold text-foreground">{p.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">{p.category}</p>
                    {p.verified && <CheckCircle2 size={12} className="text-pink-500 mx-auto mt-1" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison rows */}
            <div className="card-base overflow-hidden bg-white/5 border-white/5">
              {compareFields.map(({ label, key }, i) => (
                <div
                  key={key}
                  className={cn(
                    "p-4",
                    i < compareFields.length - 1 && "border-b border-white/5"
                  )}
                >
                  <p className="text-xs text-white/40 font-black uppercase tracking-widest mb-2">{label}</p>
                  <div className={cn("grid gap-3", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                    {selected.map((p) => {
                      const val = p[key];
                      const isTopRating = key === "rating" && Number(val) === Math.max(...selected.map(x => x.rating));
                      const isLowestPrice = key === "price" && val === selected.reduce((min, x) => {
                        const n = parseFloat(x.price.replace(/[^0-9.]/g, ""));
                        const m = parseFloat(min.replace(/[^0-9.]/g, ""));
                        return n < m ? x.price : min;
                      }, selected[0].price);
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl",
                            (isTopRating || isLowestPrice) && "bg-accent-light"
                          )}
                        >
                          {key === "rating" ? (
                            <StarRating rating={Number(val)} size={12} />
                          ) : (
                            <span className={cn(
                              "text-sm font-semibold",
                              (isTopRating || isLowestPrice) ? "text-accent" : "text-foreground"
                            )}>
                              {String(val)}
                            </span>
                          )}
                          {(isTopRating || isLowestPrice) && (
                            <span className="text-[10px] text-accent font-medium mt-0.5">Best</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability row */}
            <div className="card-base p-4">
              <p className="text-xs text-muted-foreground font-medium mb-3">Availability</p>
              <div className={cn("grid gap-3", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {selected.map((p) => (
                  <div key={p.id} className="flex flex-col items-center gap-1">
                    <span className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full",
                      p.available ? "bg-accent-light text-accent" : "bg-muted text-muted-foreground"
                    )}>
                      {p.available ? "Available" : "Busy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Book best */}
            <div className={cn("grid gap-3", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
              {selected.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate("/booking")}
                  className={cn(
                    "py-3 rounded-2xl text-sm font-semibold border transition-all",
                    p.available
                      ? "btn-primary"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                  disabled={!p.available}
                >
                  {p.available ? "Book" : "Unavailable"}
                </button>
              ))}
            </div>
          </>
        )}

        {selected.length < 2 && (
          <div className="text-center py-10">
            <BarChart2 size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Select at least 2 providers to compare</p>
          </div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  );
}
