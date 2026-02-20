import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          provider:profiles!provider_id(*),
          service:services!service_id(*)
        `)
                .eq('customer_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: "text-amber-500 bg-amber-500/10",
        confirmed: "text-blue-500 bg-blue-500/10",
        completed: "text-emerald-500 bg-emerald-500/10",
        cancelled: "text-rose-500 bg-rose-500/10"
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="p-4 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">My Bookings</h1>
                        <p className="text-muted-foreground font-medium">Manage your service appointments</p>
                    </div>
                    <Button onClick={() => navigate("/search")} className="rounded-xl font-bold gap-2">
                        <Search size={18} /> Find Services
                    </Button>
                </div>

                {/* Categories / Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Active", count: bookings.filter(b => b.status === 'confirmed').length, color: "bg-blue-500" },
                        { label: "Pending", count: bookings.filter(b => b.status === 'pending').length, color: "bg-amber-500" },
                        { label: "Finished", count: bookings.filter(b => b.status === 'completed').length, color: "bg-emerald-500" },
                        { label: "Cancelled", count: bookings.filter(b => b.status === 'cancelled').length, color: "bg-rose-500" }
                    ].map(stat => (
                        <Card key={stat.label} className="glass border-0 shadow-sm overflow-hidden">
                            <div className={cn("h-1 w-full", stat.color)} />
                            <CardContent className="p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.count}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-3">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
                        ))
                    ) : bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <Card key={booking.id} className="glass border-0 shadow-xl overflow-hidden group hover:scale-[1.01] transition-transform">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="p-5 flex-1 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", statusColors[booking.status as keyof typeof statusColors])}>
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(booking.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-black text-primary">{booking.total_price}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{booking.service?.name || "Service Item"}</h3>
                                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                                    <MapPin size={14} /> Provided by {booking.provider?.full_name}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/50 px-3 py-1.5 rounded-lg">
                                                    <Calendar size={14} className="text-primary" />
                                                    {new Date(booking.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:w-32 bg-muted/20 border-t sm:border-t-0 sm:border-l border-border/10 p-4 flex sm:flex-col items-center justify-center gap-2">
                                            <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold hover:bg-white/5" onClick={() => navigate(`/booking/${booking.id}`)}>
                                                Details
                                            </Button>
                                            {booking.status === 'confirmed' && (
                                                <Button variant="secondary" className="w-full h-10 rounded-xl text-xs font-bold">
                                                    Contact
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 px-4 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} className="text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-black mb-2">No bookings yet</h2>
                            <p className="text-muted-foreground font-medium mb-6">Find the perfect service provider for your needs.</p>
                            <Button onClick={() => navigate("/search")} className="rounded-xl px-8 font-bold">
                                Browse Services
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
