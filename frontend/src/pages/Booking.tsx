import { useEffect, useState } from "react";
import { ArrowLeft, Clock, CreditCard, Wallet, DollarSign, CheckCircle2, Sparkles, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const timeSlots = [
  { time: "8:00 AM", available: true },
  { time: "9:00 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "11:00 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "1:00 PM", available: true },
  { time: "2:00 PM", available: true },
  { time: "3:00 PM", available: true },
  { time: "4:00 PM", available: false },
];

const dates = ["Today", "Feb 20", "Feb 21", "Feb 22", "Feb 23", "Feb 24"];

const paymentMethods = [
  { id: "card", label: "Credit Card", icon: CreditCard, detail: "•••• 4242" },
  { id: "wallet", label: "Digital Wallet", icon: Wallet, detail: "Apple Pay" },
  { id: "cash", label: "Cash", icon: DollarSign, detail: "Pay in person" },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [booked, setBooked] = useState(false);
  const [notes, setNotes] = useState("");

  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    async function fetchProvider() {
      if (!id) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setProvider(data);
      setLoading(false);
    }
    fetchProvider();
  }, [id]);

  const serviceFee = provider ? parseFloat((provider.hourly_rate || "500").replace(/[^0-9.]/g, '')) : 500;
  const platformFee = 49;
  const total = serviceFee + platformFee;

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/auth");
      return;
    }
    if (!selectedSlot) return;

    setSubmitting(true);
    try {
      // Create a proper date object
      const now = new Date();
      const bookingDate = selectedDate === "Today" ? now : new Date(selectedDate + `, ${now.getFullYear()}`);

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          provider_id: id,
          status: 'pending',
          total_price: `₹${total}`,
          scheduled_at: bookingDate.toISOString(),
          notes
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Create Notification for Provider
      await supabase.from('notifications').insert({
        user_id: id,
        title: "New Booking Request",
        content: `${user.user_metadata?.full_name || 'A customer'} wants to book your service for ${selectedDate} at ${selectedSlot}.`,
        type: 'booking_request'
      });

      setBookingId(bookingData.id.slice(0, 8).toUpperCase());
      setBooked(true);
      toast.success("Booking confirmed!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!provider) return <div className="min-h-screen flex items-center justify-center">Provider not found</div>;

  if (booked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center animate-scale-in">
        <div className="fixed inset-0 pointer-events-none mesh-bg opacity-60" />
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-6 animate-bounce-in relative"
          style={{
            background: "var(--gradient-success)",
            boxShadow: "0 12px 48px hsl(158 68% 42% / 0.45)",
          }}
        >
          <CheckCircle2 size={52} className="text-primary-foreground" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-2 tracking-tight">Booking Confirmed!</h2>
        <p className="text-muted-foreground text-sm mb-1 font-medium">{provider.full_name || provider.name} is confirmed for</p>
        <p className="text-primary font-bold text-base mb-8">{selectedDate} at {selectedSlot}</p>
        <div className="glass-card w-full p-5 mb-6 text-left space-y-3">
          {[
            { label: "Booking ID", value: `#LS-${bookingId}` },
            { label: "Service", value: provider.category || "Service" },
            { label: "Total Paid", value: `₹${total}`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">{label}</span>
              <span className={cn("font-bold", accent ? "text-accent" : "text-foreground")}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/")} className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2">
          <Sparkles size={18} />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="fixed inset-0 pointer-events-none z-0 mesh-bg opacity-50" />

      {/* Header */}
      <div className="gradient-hero-bg px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-3xl animate-float" />
        <div className="relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl glass flex items-center justify-center mb-5 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={18} className="text-primary-foreground" />
          </button>
          <h1 className="text-primary-foreground text-2xl font-black tracking-tight">Book Appointment</h1>
          <p className="text-primary-foreground/75 text-sm mt-1 font-medium">{provider.full_name || provider.name} · {provider.category || "Provider"}</p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 relative z-10 animate-slide-up">
        {/* Date selection */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Select Date
          </h3>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
            {dates.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={cn(
                  "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 active:scale-95",
                  selectedDate === d
                    ? "border-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                )}
                style={selectedDate === d ? {
                  background: "hsl(var(--primary))",
                  boxShadow: "0 4px 16px hsl(var(--primary) / 0.35)",
                } : {}}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Available Slots
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(({ time, available }, i) => (
              <button
                key={time}
                disabled={!available}
                onClick={() => setSelectedSlot(time)}
                className={cn(
                  "py-3 rounded-xl text-xs font-bold border transition-all duration-200",
                  !available
                    ? "border-border bg-muted text-muted-foreground line-through opacity-40 cursor-not-allowed"
                    : selectedSlot === time
                      ? "text-primary-foreground border-transparent scale-105"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:scale-[1.02]"
                )}
                style={selectedSlot === time && available ? {
                  background: "hsl(var(--primary))",
                  boxShadow: "0 4px 16px hsl(var(--primary) / 0.35)",
                } : {}}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Notes for Provider</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue or any special instructions..."
            rows={3}
            className="w-full text-sm text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 outline-none resize-none border transition-all"
            style={{
              background: "hsl(var(--muted) / 0.5)",
              borderColor: "hsl(var(--border))",
            }}
            onFocus={(e) => (e.target.style.borderColor = "hsl(var(--primary))")}
            onBlur={(e) => (e.target.style.borderColor = "hsl(var(--border))")}
          />
        </div>

        {/* Payment */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map(({ id, label, icon: Icon, detail }) => (
              <button
                key={id}
                onClick={() => setSelectedPayment(id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200",
                  selectedPayment === id
                    ? "border-primary/60"
                    : "border-border hover:border-primary/25"
                )}
                style={selectedPayment === id ? {
                  background: "hsl(var(--primary-light))",
                } : {
                  background: "hsl(var(--card))",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={selectedPayment === id ? {
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 4px 12px hsl(var(--primary) / 0.35)",
                  } : {
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn("text-sm font-bold", selectedPayment === id ? "text-primary" : "text-foreground")}>{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
                <div
                  className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", selectedPayment === id ? "border-primary" : "border-border")}
                >
                  {selectedPayment === id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div
          className="glass-card p-4"
          style={{ background: "var(--gradient-card)" }}
        >
          <h3 className="text-sm font-bold text-foreground mb-3">Price Summary</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee (1 hr)</span>
              <span className="text-foreground font-semibold">₹{serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee</span>
              <span className="text-foreground font-semibold">₹{platformFee}</span>
            </div>
            <div
              className="pt-2.5 mt-1 flex justify-between"
              style={{ borderTop: "1.5px dashed hsl(var(--border))" }}
            >
              <span className="text-sm font-black text-foreground">Total</span>
              <span className="text-lg font-black text-pink-500">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Confirm button */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
        <button
          onClick={handleConfirmBooking}
          disabled={!selectedSlot || submitting}
          className={cn(
            "btn-primary w-full text-base py-4 flex items-center justify-center gap-2 transition-all",
            (!selectedSlot || submitting) && "opacity-40 cursor-not-allowed"
          )}
        >
          <Sparkles size={18} />
          {submitting ? "Processing..." : selectedSlot ? `Confirm Booking · ₹${total}` : "Select a Time Slot"}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
