import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, Bot } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
        { role: 'bot', content: "Hello! I'm LocalServe AI. How can I help you find a local service today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = message.trim();
        setMessage("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('handle-ai-chat', {
                body: { message: userMsg, context: { current_page: window.location.pathname } }
            });

            if (error) throw error;
            setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-glow-pulse"
            >
                <MessageSquare size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-24 right-4 z-50 w-[calc(100vw-32px)] sm:w-96 h-[500px] flex flex-col glass rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary flex items-center justify-between text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight">LocalServe AI</h3>
                                    <p className="text-[10px] opacity-75 font-medium">Always here to help</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "max-w-[85%] p-3 rounded-2xl text-sm font-medium leading-relaxed",
                                        m.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-white dark:bg-muted text-foreground shadow-sm border border-border/50 rounded-tl-none"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-center gap-2 text-muted-foreground animate-pulse ml-1">
                                    <Bot size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Thinking...</span>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-background border-t border-border/50 flex gap-2">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="How do I book a plumber?"
                                className="flex-1 bg-muted px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-primary/20 border-0"
                            />
                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
