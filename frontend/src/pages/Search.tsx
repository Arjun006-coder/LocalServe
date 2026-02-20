import { useEffect, useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Map, List, X, Sparkles, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "@/components/ProviderCard";
import CategoryGrid from "@/components/CategoryGrid";
import BottomNav from "@/components/BottomNav";
import LocationMap from "@/components/LocationMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import heroMap from "@/assets/hero-map.png";

const priceFilters = ["Any", "Under ₹500", "₹500–₹1.5K", "₹1.5K+"];
const distanceFilters = ["0.5 mi", "1 mi", "5 mi", "Any"];

export default function SearchPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "map">("list");
  const [search, setSearch] = useState("");
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Re-adding filters state to fix component errors
  const { location: userCoords } = useGeolocation();
  const [priceFilter, setPriceFilter] = useState("Any");
  const [distFilter, setDistFilter] = useState("Any");
  const [cityFilter, setCityFilter] = useState("");

  const mapCenter: [number, number] = userCoords ? [userCoords.lat, userCoords.lng] : [28.6139, 77.2090]; // Default to Delhi

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider');

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,occupation.ilike.%${search}%,occupation_type.ilike.%${search}%`);
      }

      if (cityFilter) {
        query = query.ilike('city', `%${cityFilter}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching providers:", error);
      } else {
        setProviders(data || []);
      }
      setLoading(false);
    }

    const timer = setTimeout(() => {
      fetchProviders();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Temporary local filter for price/dist until backend logic is added
  const filtered = providers;

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="fixed inset-0 pointer-events-none z-0 mesh-bg opacity-50" />

      <div
        className="sticky top-0 z-30 px-4 pt-12 pb-3"
        style={{
          background: "hsl(0 0% 100% / 0.72)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          borderBottom: "1px solid hsl(var(--border))",
          boxShadow: "0 4px 24px hsl(222 35% 10% / 0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: "hsl(var(--muted))" }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experts, plumbers, developers..."
              className="input-search pl-10 pr-10 py-2.5 text-sm font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center transition-all hover:scale-110"
              >
                <X size={12} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95",
            )}
            style={showFilters ? {
              background: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 4px 16px hsl(var(--primary) / 0.4)",
            } : {
              background: "hsl(var(--muted))",
            }}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {showFilters && (
          <div className="pb-3 space-y-3 animate-slide-down">
            <div
              className="p-3 rounded-2xl space-y-3"
              style={{
                background: "hsl(var(--muted) / 0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Price Range</p>
                <div className="flex gap-2 flex-wrap">
                  {priceFilters.map((f) => (
                    <button key={f} onClick={() => setPriceFilter(f)} className={cn("chip", priceFilter === f && "active")}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wide">City / Location</p>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="e.g. Delhi, Mumbai"
                    className="w-full bg-background/50 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium border-0 outline-none focus:ring-2 ring-primary/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <Sparkles size={13} className="text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              <span className="text-foreground font-bold">{filtered?.length || 0}</span> results
            </p>
          </div>
          <div
            className="flex p-1 rounded-xl gap-1"
            style={{ background: "hsl(var(--muted))" }}
          >
            {([
              { key: "list", label: "List", Icon: List },
              { key: "map", label: "Map", Icon: Map },
            ] as const).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                  view === key ? "text-foreground shadow-sm" : "text-muted-foreground"
                )}
                style={view === key ? {
                  background: "hsl(0 0% 100% / 0.85)",
                  backdropFilter: "blur(8px)",
                } : {}}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 relative z-10">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-24 rounded-3xl bg-muted animate-pulse" />)}
          </div>
        ) : view === "map" ? (
          <div className="space-y-4 animate-fade-in relative z-0">
            <LocationMap center={mapCenter} providers={filtered} userLocation={userCoords ? [userCoords.lat, userCoords.lng] : null} />
            <div className="space-y-3">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <ProviderCard provider={p} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="overflow-x-auto hide-scrollbar mb-4">
              <CategoryGrid onSelect={() => { }} />
            </div>
            <div className="space-y-3">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <ProviderCard provider={p} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="h-4" />
      </div>

      <div className="fixed bottom-20 right-4 z-40 animate-bounce-in">
        <button
          onClick={() => navigate("/compare")}
          className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 animate-glow-pulse"
        >
          <Sparkles size={14} />
          Compare
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
