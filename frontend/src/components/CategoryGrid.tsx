import { Wrench, Zap, BookOpen, Car, Sparkles, ChefHat, Hammer, Leaf, Code, Smartphone, Database, Cpu, Share2, Globe, Music, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "ml-engineer", label: "ML Engineer", icon: Cpu, gradient: "from-rose-500 to-pink-600", glow: "hsl(340 82% 52% / 0.3)" },
  { id: "web-dev", label: "Web Dev", icon: Code, gradient: "from-cyan-500 to-blue-600", glow: "hsl(190 70% 45% / 0.3)" },
  { id: "app-dev", label: "App Dev", icon: Smartphone, gradient: "from-indigo-500 to-purple-600", glow: "hsl(245 80% 60% / 0.3)" },
  { id: "full-stack", label: "Full Stack", icon: Database, gradient: "from-emerald-500 to-teal-600", glow: "hsl(150 80% 40% / 0.3)" },
  { id: "social-media", label: "Social Media", icon: Share2, gradient: "from-orange-500 to-red-600", glow: "hsl(20 80% 50% / 0.3)" },
  { id: "graphic-design", label: "Designer", icon: Palette, gradient: "from-fuchsia-500 to-pink-600", glow: "hsl(300 80% 60% / 0.3)" },
  { id: "plumber", label: "Plumber", icon: Wrench, gradient: "from-blue-500 to-blue-600", glow: "hsl(217 91% 60% / 0.3)" },
  { id: "electrician", label: "Electrician", icon: Zap, gradient: "from-amber-400 to-orange-500", glow: "hsl(38 92% 55% / 0.3)" },
  { id: "tutor", label: "Tutor", icon: BookOpen, gradient: "from-violet-500 to-purple-600", glow: "hsl(270 80% 60% / 0.3)" },
  { id: "mechanic", label: "Mechanic", icon: Hammer, gradient: "from-slate-600 to-slate-800", glow: "hsl(210 20% 50% / 0.3)" },
  { id: "cleaning", label: "Cleaning", icon: Sparkles, gradient: "from-teal-400 to-emerald-500", glow: "hsl(160 81% 43% / 0.3)" },
  { id: "chef", label: "Chef", icon: ChefHat, gradient: "from-orange-500 to-red-600", glow: "hsl(15 91% 54% / 0.3)" },
];

interface CategoryGridProps {
  onSelect?: (id: string) => void;
  className?: string;
}

export default function CategoryGrid({ onSelect, className }: CategoryGridProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {categories.map((category, i) => (
        <button
          key={category.id}
          onClick={() => onSelect?.(category.id)}
          className="group relative h-32 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 text-left"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {/* Background Gradient */}
          <div className={cn("absolute inset-0 bg-gradient-to-br transition-opacity duration-500 group-hover:opacity-90", category.gradient)} />

          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] border border-white/10" />

          {/* Glow Effect */}
          <div
            className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-full"
            style={{ backgroundColor: category.glow }}
          />

          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <category.icon size={20} className="text-white" />
            </div>

            <div className="space-y-0.5">
              <p className="text-white font-black text-sm tracking-tight">{category.label}</p>
              <div className="h-0.5 w-0 group-hover:w-8 bg-white/60 transition-all duration-500 rounded-full" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
