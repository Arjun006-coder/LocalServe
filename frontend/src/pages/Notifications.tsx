import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Bell, CheckCircle2, AlertCircle, Clock, ArrowLeft, Trash2, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";

export default function Notifications() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchNotifications();

        // Subscribe to new notifications
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    setNotifications(prev => [payload.new, ...prev]);
                    toast("New notification received!");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const { error } = await supabase.from('notifications').delete().eq('id', id);
            if (error) throw error;
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success("Notification deleted");
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking_request': return <Calendar className="text-blue-500" size={18} />;
            case 'booking_confirmed': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'booking_cancelled': return <AlertCircle className="text-rose-500" size={18} />;
            default: return <Bell className="text-primary" size={18} />;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="p-4 max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-2xl glass flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <Button variant="ghost" className="text-xs font-bold text-primary" onClick={() => notifications.forEach(n => !n.is_read && markAsRead(n.id))}>
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="space-y-3">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-muted/50 animate-pulse" />
                        ))
                    ) : notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id)}
                                className={cn(
                                    "p-4 rounded-2xl transition-all cursor-pointer border-2 relative group",
                                    n.is_read ? "bg-background border-muted/30" : "bg-primary/5 border-primary/20 shadow-md shadow-primary/5"
                                )}
                            >
                                {!n.is_read && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-bold text-sm leading-tight pr-6">{n.title}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{n.content}</p>
                                        <p className="text-[10px] text-muted-foreground/60 font-bold flex items-center gap-1 pt-1 uppercase">
                                            <Clock size={10} /> {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(n.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteNotification(n.id, e)}
                                        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 px-4 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Bell size={32} className="text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-black mb-2">You're all caught up!</h2>
                            <p className="text-muted-foreground font-medium">New notifications will appear here as they arrive.</p>
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
