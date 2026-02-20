import { CheckCircle2, MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import { cn } from "@/lib/utils";

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  distance: string;
  available: boolean;
  verified: boolean;
  responseTime: string;
  initials: string;
  color: string;
}

interface ProviderCardProps {
  provider: Provider;
  compact?: boolean;
  className?: string;
}

export default function ProviderCard({ provider: p, compact = false, className }: ProviderCardProps) {
  const navigate = useNavigate();

  // Map Supabase fields to UI expectations
  const provider = {
    ...p,
    name: (p as any).full_name || p.name,
    verified: (p as any).is_verified ?? p.verified,
    reviews: (p as any).review_count ?? p.reviews,
    price: (p as any).hourly_rate ?? p.price,
    responseTime: (p as any).response_time ?? p.responseTime,
  };

  return (
    <div
      className={cn("provider-card group", className)}
      onClick={() => navigate(`/provider/${provider.id}`)}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-primary-foreground relative overflow-hidden transition-transform group-hover:scale-105",
            provider.color
          )}
          style={{ boxShadow: "0 4px 12px hsl(0 0% 0% / 0.15)" }}
        >
          {provider.initials}
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent pointer-events-none" />
        </div>
        {provider.available && (
          <span className="badge-online absolute -bottom-0.5 -right-0.5 animate-pulse-dot" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-bold text-sm text-foreground truncate">{provider.name}</span>
          {provider.verified && (
            <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1.5 font-medium">{provider.category}</p>
        <StarRating rating={provider.rating} count={provider.reviews} />

        {!compact && (
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={10} className="text-primary/60" />
              {provider.distance}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={10} className="text-accent/70" />
              {provider.responseTime}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 bg-white/5 p-2 rounded-xl backdrop-blur-md">
        <span className="text-sm font-black text-foreground">₹{provider.price.replace(/[^0-9.]/g, '')}</span>
        <span className={cn(
          "text-[10px] font-bold px-2.5 py-1 rounded-full",
          provider.available
            ? "bg-emerald-500/20 text-emerald-500"
            : "bg-muted text-muted-foreground"
        )}>
          {provider.available ? "Ready now" : "Engaged"}
        </span>
      </div>
    </div>
  );
}
