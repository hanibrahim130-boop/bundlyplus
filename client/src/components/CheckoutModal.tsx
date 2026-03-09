import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setFullName("");
      setEmailError("");
      setOrderId("");
      setStep("form");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!product) return null;

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const openWhatsApp = (createdOrderId: string) => {
    const whatsappNumber = "96170123456";
    const message = encodeURIComponent(
      [
        "Hi! I want to complete a new order from BundlyPlus.",
        `Order ID: ${createdOrderId}`,
        `Product: ${product.name}`,
        `Price: $${product.price}`,
        `Name: ${fullName || "Not provided"}`,
        `Email: ${email}`,
      ].join("\n")
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setEmailError("Email is required"); return; }
    if (!validateEmail(email)) { setEmailError("Please enter a valid email"); return; }

    setIsSubmitting(true);
    setEmailError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email, fullName, paymentMethod: "WHATSAPP" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to create order");
      setOrderId(data.id);
      setStep("done");
      openWhatsApp(data.id);
      toast({ title: "Order created!", description: "WhatsApp opened successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to create order. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[min(calc(100vw-2rem),32rem)] bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        {step === "form" ? (
          <div className="p-5 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold uppercase tracking-tight">Request via WhatsApp</DialogTitle>
              <DialogDescription>
                Create your order, then continue directly with us on WhatsApp to complete the purchase.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 p-4 bg-[#F8F8F8] rounded-2xl mb-8">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm bg-white">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-[14px]">{product.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  <span className="text-[10px] text-[#666666] uppercase font-bold tracking-wider">{product.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#666666] px-1 mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-14 px-4 rounded-2xl border border-[#EEEEEE] focus:border-primary focus:outline-none transition-colors text-[14px]"
                  data-testid="input-fullname"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#666666] px-1 mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="your@email.com"
                    className={`w-full h-14 pl-12 pr-4 rounded-2xl border ${emailError ? "border-red-500" : "border-[#EEEEEE]"} focus:border-primary focus:outline-none transition-colors text-[14px]`}
                    data-testid="input-email"
                  />
                </div>
                {emailError && <p className="text-red-500 text-[11px] mt-2 px-1">{emailError}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white uppercase font-bold text-[12px] tracking-wider mt-2"
                data-testid="button-submit-order"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Order</>
                ) : (
                  <><MessageCircle className="w-4 h-4 mr-2" />Continue on WhatsApp</>
                )}
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-[#666666] font-medium uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Orders are confirmed manually through WhatsApp
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight mb-3">Order Created</h3>
            <p className="text-sm text-[#666666] mb-2">Order ID: <strong>{orderId}</strong></p>
            <p className="text-sm text-[#666666] mb-8">We opened WhatsApp so you can complete the purchase directly with us.</p>
            <Button
              onClick={() => openWhatsApp(orderId)}
              className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white uppercase font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
