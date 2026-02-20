import { useNavigate } from "react-router-dom";
import {
    Bell, MapPin, Search, ChevronRight, Filter, TrendingUp, Sparkles,
    ShieldCheck, Zap, Users, Star, ArrowRight, Briefcase, IndianRupee,
    CheckCircle2, Globe, Clock, Quote, Mail, Phone, Instagram, Twitter, Linkedin
} from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";
import ProviderCard from "@/components/ProviderCard";
import BottomNav from "@/components/BottomNav";
import AIChat from "@/components/AIChat";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export default function Index() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProviders() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'provider')
                .limit(4);

            if (!error) setProviders(data || []);
            setLoading(false);
        }
        fetchProviders();
    }, []);

    return (
        <div className="min-h-screen bg-[#0e1116] text-white pb-24 selection:bg-pink-500 selection:text-white">
            {/* Navigation Backdrop */}
            <div className="fixed top-0 inset-x-0 h-20 bg-[#0e1116]/90 backdrop-blur-xl z-50 border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center font-black italic transition-all group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">L</div>
                    <span className="text-xl font-bold tracking-tighter hover:text-pink-500 transition-colors">LocalServe</span>
                </div>
                <div className="flex items-center gap-6">
                    {!user ? (
                        <>
                            <button onClick={() => navigate("/auth")} className="text-sm font-bold hover:text-pink-500 transition-colors">Log In</button>
                            <button onClick={() => navigate("/auth")} className="text-sm font-bold hover:text-pink-500 transition-colors">Sign Up</button>
                        </>
                    ) : (
                        <button onClick={() => navigate("/user-dashboard")} className="text-sm font-bold hover:text-pink-500 transition-colors">Dashboard</button>
                    )}
                    <Button onClick={() => navigate("/auth")} className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-md px-4 py-2 hidden sm:flex">
                        Get Started / Post Service
                    </Button>
                </div>
            </div>

            {/* Hero Section - Matching User Image */}
            <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0e1116] via-[#0e1116]/90 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                            Hire the best local experts <br />
                            <span className="text-pink-500 font-black">right in your city.</span>
                        </h1>

                        <ul className="space-y-4">
                            {[
                                "India's growing local expertise marketplace",
                                "From Plumbers to ML Engineers, all at your door",
                                "Verified background checks & safe payments",
                                "Direct communication with local professionals"
                            ].map((text, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-lg text-white/70 font-medium"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                    {text}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button
                                onClick={() => navigate(user ? "/search" : "/auth")}
                                className="h-14 px-10 bg-pink-600 hover:bg-pink-700 text-white font-black text-lg rounded-md transition-all hover:scale-105"
                            >
                                Hire an Expert
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/auth")}
                                className="h-14 px-10 border-2 border-white/20 hover:border-white hover:bg-white/5 text-white font-black text-lg rounded-md transition-all"
                            >
                                Offer your Expertise
                            </Button>
                        </div>
                    </motion.div>

                    {/* Dashboard Preview / Real Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative z-10 p-4 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_rgba(225,29,72,0.15)] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-50" />
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                                alt="LocalServe Dashboard"
                                className="rounded-[2.5rem] w-full shadow-2xl opacity-90 group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute bottom-8 left-0 right-0 text-center px-8">
                                <p className="text-xs font-black bg-black/80 backdrop-blur-xl inline-block py-3 px-6 rounded-full border border-white/20 uppercase tracking-widest shadow-2xl">
                                    Verified Service Earnings: <span className="text-pink-500">₹45,200</span> This Month
                                </p>
                            </div>
                        </div>
                        {/* Ambient glows */}
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-600/30 blur-[100px] rounded-full animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse" />
                    </motion.div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="container mx-auto px-6 space-y-24 py-24">

                {/* Global Network Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { icon: Globe, val: "50+", label: "Cities covered", sub: "Expanding across India" },
                        { icon: Users, val: "10K+", label: "Verified Partners", sub: "Trustworthy professionals" },
                        { icon: IndianRupee, val: "₹5Cr+", label: "Earnings generated", sub: "Empowering local talent" },
                        { icon: ShieldCheck, val: "100%", label: "Safe Transfers", sub: "Secure escrow payments" }
                    ].map((item, i) => (
                        <div key={i} className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <item.icon className="text-pink-500" size={24} />
                            <h3 className="text-3xl font-black tracking-tight">{item.val}</h3>
                            <p className="text-sm font-bold text-white/80">{item.label}</p>
                            <p className="text-xs text-white/50">{item.sub}</p>
                        </div>
                    ))}
                </section>


                {/* Featured Providers */}
                <div className="space-y-10">
                    <div className="flex items-end justify-between border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-4xl font-black italic">Top Rated Near You</h2>
                            <p className="text-white/60 font-medium mt-2">Highly recommended experts using LocalServe smart matching.</p>
                        </div>
                        {user && (
                            <Button onClick={() => navigate("/search")} variant="outline" className="border-white/20 hover:bg-white/5 text-white font-bold px-8">
                                Find More Experts
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)
                        ) : providers.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                </div>

                {/* Testimonial - Enhanced Glassmorphism & 3D Effect */}
                <section className="perspective-[2000px] py-12">
                    <motion.div
                        whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-pink-600/20 to-indigo-800/20 rounded-[3rem] p-12 relative overflow-hidden group backdrop-blur-3xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] transform-gpu transition-all duration-700 hover:shadow-pink-600/20"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 max-w-3xl space-y-8">
                            <div className="w-16 h-16 rounded-2xl bg-pink-600/20 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-inner">
                                <Quote className="text-pink-500 fill-pink-500/20" size={32} />
                            </div>
                            <p className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white/95">
                                "LocalServe connected me with an ML expert in Mumbai for my startup project. The quality was insane and it was so much faster than traditional hiring."
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 border-2 border-white/20 flex items-center justify-center font-black text-lg shadow-xl">AS</div>
                                <div>
                                    <p className="font-black text-xl text-white tracking-tight">Arjun Singh</p>
                                    <p className="text-pink-500/80 font-bold text-sm uppercase tracking-widest">Founder, AI-Stream India</p>
                                </div>
                            </div>
                        </div>

                        {/* 3D Glass Layer overlay */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)' }} />
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center font-black italic">L</div>
                                <span className="text-xl font-bold tracking-tighter">LocalServe</span>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Empowering India's local talent with the best technology matching. Safe, reliable, and expert services at your fingertips.
                            </p>
                            <div className="flex gap-4">
                                <Twitter size={20} className="text-white/40 hover:text-pink-500 cursor-pointer transition-colors" />
                                <Linkedin size={20} className="text-white/40 hover:text-pink-500 cursor-pointer transition-colors" />
                                <Instagram size={20} className="text-white/40 hover:text-pink-500 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold uppercase tracking-widest text-xs text-white/40">Services</h4>
                            <ul className="space-y-3 text-sm font-bold text-white/80">
                                <li className="hover:text-pink-500 cursor-pointer">Technical Help</li>
                                <li className="hover:text-pink-500 cursor-pointer">Home Maintenance</li>
                                <li className="hover:text-pink-500 cursor-pointer">Development</li>
                                <li className="hover:text-pink-500 cursor-pointer">Education</li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold uppercase tracking-widest text-xs text-white/40">Company</h4>
                            <ul className="space-y-3 text-sm font-bold text-white/80">
                                <li className="hover:text-pink-500 cursor-pointer">About Team</li>
                                <li className="hover:text-pink-500 cursor-pointer">Careers</li>
                                <li className="hover:text-pink-500 cursor-pointer">Trust & Safety</li>
                                <li className="hover:text-pink-500 cursor-pointer">Terms of Service</li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-bold uppercase tracking-widest text-xs text-white/40">Contact</h4>
                            <ul className="space-y-3 text-sm font-bold text-white/80">
                                <li className="flex items-center gap-2 font-medium">
                                    <Mail size={16} className="text-pink-500" /> support@localserve.in
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <Phone size={16} className="text-pink-500" /> +91 (800) 123-4567
                                </li>
                                <li className="flex items-center gap-2 font-medium">
                                    <MapPin size={16} className="text-pink-500" /> Cyber Hub, Gurugram, India
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 gap-4">
                        <p className="text-xs text-white/30 font-medium">© 2026 LocalServe. Built with ❤️ for India.</p>
                        <div className="flex gap-6 text-xs text-white/30 font-medium italic">
                            <span>Made by the AI Tech Team</span>
                            <span>Fast · Secure · Local</span>
                        </div>
                    </div>
                </footer>

            </div>

            <BottomNav />
            {user && <AIChat />}
        </div>
    );
}
