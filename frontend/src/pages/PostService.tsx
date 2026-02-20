import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Sparkles, Clock, IndianRupee } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";

export default function PostService() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [pricingType, setPricingType] = useState<"fixed" | "hourly">("hourly");
    const [estimatedTime, setEstimatedTime] = useState("");

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('services')
                .insert({
                    provider_id: user.id,
                    name,
                    category,
                    description,
                    price: parseFloat(price),
                    pricing_type: pricingType,
                    estimated_time: estimatedTime
                });

            if (error) throw error;
            toast.success("Service posted successfully!");
            navigate("/worker-dashboard");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="p-4 max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-2xl glass flex items-center justify-center mb-6"
                >
                    <ArrowLeft size={18} />
                </button>

                <Card className="glass border-0 shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                <Plus size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black">Post a Service</CardTitle>
                                <CardDescription>Share your expertise with the community</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePost} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="sc-name">Service Name</Label>
                                <Input
                                    id="sc-name"
                                    placeholder="e.g., Deep Kitchen Cleaning"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="repair">Repair</SelectItem>
                                        <SelectItem value="tutoring">Tutoring</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sc-desc">Description</Label>
                                <textarea
                                    id="sc-desc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border-muted bg-background/50 p-4 text-sm outline-none focus:ring-2 ring-primary/20 resize-none"
                                    placeholder="Explain what's included in this service..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pricing Type</Label>
                                    <Select value={pricingType} onValueChange={(v: any) => setPricingType(v)}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Per Hour</SelectItem>
                                            <SelectItem value="fixed">Fixed Price</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sc-price">Price (₹)</Label>
                                    <div className="relative">
                                        <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="sc-price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="pl-8 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sc-time">Estimated Time</Label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="sc-time"
                                        placeholder="e.g., 2-3 hours"
                                        value={estimatedTime}
                                        onChange={(e) => setEstimatedTime(e.target.value)}
                                        className="pl-10 rounded-xl"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full rounded-xl py-6 font-bold text-lg shadow-xl shadow-primary/20" disabled={loading}>
                                {loading ? "Posting..." : "Launch Service"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <BottomNav />
        </div>
    );
}
