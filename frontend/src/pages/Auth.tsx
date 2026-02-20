import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, ArrowLeft, ChevronRight, ChevronLeft, MapPin, Briefcase, Phone, Mail, Lock, Users } from "lucide-react";
import { TECHNICAL_OCCUPATIONS, NON_TECHNICAL_OCCUPATIONS, STATES } from "@/constants/occupations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Auth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [view, setView] = useState<"login" | "register">("login");
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState("");

    // Auth State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Profile State
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<"user" | "provider">("user");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [occupationType, setOccupationType] = useState<"technical" | "non-technical">("technical");
    const [occupation, setOccupation] = useState("");
    const [bio, setBio] = useState("");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Auth User with full data in metadata
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                        phone: phone,
                        city: city,
                        occupation: role === 'provider' ? occupation : null,
                        bio: bio
                    },
                },
            });
            if (error) throw error;

            if (data.user) {
                // Instead of moving to login, move to verification
                setIsVerifying(true);
                toast.success("OTP sent to your email!");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
            });
            if (error) throw error;

            toast.success("Email verified! Redirecting...");
            navigate("/");
        } catch (error: any) {
            toast.error("Invalid code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            toast.success("Welcome back!");
            navigate("/");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="min-h-screen bg-background flex flex-col p-4 relative overflow-hidden">
            {/* Mesh background */}
            <div className="fixed inset-0 pointer-events-none z-0 mesh-bg opacity-40" />

            <button
                onClick={() => isVerifying ? setIsVerifying(false) : navigate("/")}
                className="relative z-10 w-10 h-10 rounded-2xl glass flex items-center justify-center mb-8 transition-all hover:scale-105 active:scale-95"
            >
                <ArrowLeft size={18} className="text-foreground" />
            </button>

            <div className="flex-1 flex items-center justify-center relative z-10">
                <Card className="w-full max-w-lg glass border-0 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
                                <Sparkles size={24} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight">
                            {isVerifying ? "Verify Account" : view === "login" ? "Welcome Back" : `Step ${step} of 3`}
                        </CardTitle>
                        <CardDescription className="font-medium text-muted-foreground">
                            {isVerifying ? `Enter the 6-digit code sent to ${email}` : view === "login" ? "Sign in to your account" : "Complete your profile to get started"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        {isVerifying ? (
                            <form onSubmit={handleVerifyOtp} className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-4">
                                    <div className="flex justify-center gap-2">
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            placeholder="······"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="text-center text-3xl font-black tracking-[1em] h-16 rounded-2xl border-white/5 bg-white/5 focus:ring-pink-500/20"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground font-medium">
                                        Didn't receive a code? <button type="button" className="text-pink-500 font-bold hover:underline">Resend</button>
                                    </p>
                                </div>
                                <Button type="submit" className="w-full rounded-xl py-6 font-bold bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-600/20" disabled={loading || otp.length < 6}>
                                    {loading ? "Verifying..." : "Confirm Code"}
                                </Button>
                                <button type="button" onClick={() => setIsVerifying(false)} className="w-full text-xs font-bold text-muted-foreground hover:text-white transition-colors">
                                    Use a different account
                                </button>
                            </form>
                        ) : view === "login" ? (
                            <form onSubmit={handleSignIn} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10 rounded-xl border-white/5 bg-white/5 focus:ring-pink-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 rounded-xl border-white/5 bg-white/5 focus:ring-pink-500/20"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full rounded-xl py-6 font-bold bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-600/20 mt-2" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In to LocalServe"}
                                </Button>
                                <div className="text-center mt-4">
                                    <button type="button" onClick={() => setView("register")} className="text-sm font-bold text-pink-500 hover:underline">
                                        New to LocalServe? Join Now
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-2">
                                {step === 1 && (
                                    <div className="space-y-6 pt-2">
                                        <div className="text-center space-y-2 mb-6">
                                            <h3 className="text-lg font-bold">How would you like to join?</h3>
                                            <p className="text-sm text-muted-foreground font-medium">Choose your account type to continue</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: "user", label: "I want to Hire Experts", desc: "Access verified local professionals and tech experts for your needs.", icon: Users, color: "bg-blue-500/10 text-blue-500" },
                                                { id: "provider", label: "I want to Offer Services", desc: "List your skills, find local demands, and earn with secure payments.", icon: Briefcase, color: "bg-pink-500/10 text-pink-500" }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => { setRole(opt.id as any); nextStep(); }}
                                                    className={cn(
                                                        "p-6 rounded-[2rem] border-2 text-left transition-all group flex items-start gap-4 hover:scale-[1.02]",
                                                        role === opt.id ? "border-pink-500 bg-pink-500/5 shadow-xl" : "border-white/5 bg-white/5 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", opt.color)}>
                                                        <opt.icon size={24} />
                                                    </div>
                                                    <div>
                                                        <p className={cn("font-black text-lg transition-colors", role === opt.id ? "text-pink-500" : "text-white")}>{opt.label}</p>
                                                        <p className="text-xs text-white/50 font-medium leading-relaxed mt-1">{opt.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-center pt-4">
                                            <button type="button" onClick={() => setView("login")} className="text-xs font-bold text-muted-foreground hover:text-pink-500">
                                                Already have an account? Sign In
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-name">Full Name</Label>
                                            <Input
                                                id="reg-name"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="rounded-xl border-white/5 bg-white/5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-email">Email</Label>
                                            <Input
                                                id="reg-email"
                                                type="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="rounded-xl border-white/5 bg-white/5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-password">Password</Label>
                                            <Input
                                                id="reg-password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="rounded-xl border-white/5 bg-white/5"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl py-6 border-white/10 hover:bg-white/5">
                                                Back
                                            </Button>
                                            <Button
                                                onClick={nextStep}
                                                disabled={!fullName || !email || !password}
                                                className="flex-[2] rounded-xl py-6 font-bold bg-pink-600 hover:bg-pink-700"
                                            >
                                                Next Step
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4 pt-2">
                                        {role === "provider" ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Professional Skillset</Label>
                                                    <Select value={occupation} onValueChange={setOccupation}>
                                                        <SelectTrigger className="rounded-xl border-white/5 bg-white/5">
                                                            <SelectValue placeholder="Select your expertise" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TECHNICAL_OCCUPATIONS.concat(NON_TECHNICAL_OCCUPATIONS).map(occ => (
                                                                <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Bio / Experience</Label>
                                                    <textarea
                                                        value={bio}
                                                        onChange={(e) => setBio(e.target.value)}
                                                        className="w-full rounded-xl border-white/5 bg-white/5 p-4 text-sm outline-none focus:ring-2 ring-pink-500/20 h-24 resize-none"
                                                        placeholder="Describe what you do..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <Input
                                                        id="phone"
                                                        placeholder="+91 98765 43210"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="rounded-xl border-white/5 bg-white/5"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="city">City / Location</Label>
                                                    <Input
                                                        id="city"
                                                        placeholder="e.g. Gurugram"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        className="rounded-xl border-white/5 bg-white/5"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-3 pt-4">
                                            <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl py-6 border-white/10 hover:bg-white/5">
                                                Back
                                            </Button>
                                            <Button onClick={handleSignUp} className="flex-[2] rounded-xl py-6 font-bold bg-pink-600 hover:bg-pink-700" disabled={loading}>
                                                {loading ? "Creating Account..." : "Join LocalServe"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-muted/20 bg-muted/10 py-4 mt-auto">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                            Secure Authentication · Powered by Supabase
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
