import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Save, Eye, EyeOff } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useAdminAuth, adminFetch } from "./useAdminAuth";

const INPUT = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#ff7a4d]/60 focus:ring-1 focus:ring-[#ff7a4d]/20 transition";

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <h2 style={{ fontFamily: "var(--font-syne)" }} className="font-bold text-white text-sm">{title}</h2>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { verified } = useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [form, setForm] = useState({
    site_name: "", hero_title: "", hero_subtitle: "", hero_cta: "", whatsapp_number: "",
    current_password: "", new_password: "", confirm_password: "",
  });
  const [pwError, setPwError] = useState("");

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["/api/admin/settings"],
    queryFn: () => adminFetch("/api/admin/settings").then((r) => r.json()),
    enabled: !!verified,
  });

  useEffect(() => {
    if (settings) {
      setForm((f) => ({
        ...f,
        site_name: settings.site_name ?? "",
        hero_title: settings.hero_title ?? "",
        hero_subtitle: settings.hero_subtitle ?? "",
        hero_cta: settings.hero_cta ?? "",
        whatsapp_number: settings.whatsapp_number ?? "",
      }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, string>) =>
      adminFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(payload) }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Failed to save");
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSaveGeneral(e: React.FormEvent) {
    e.preventDefault();
    await saveMutation.mutateAsync({ site_name: form.site_name, hero_title: form.hero_title, hero_subtitle: form.hero_subtitle, hero_cta: form.hero_cta, whatsapp_number: form.whatsapp_number });
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (form.new_password !== form.confirm_password) { setPwError("Passwords do not match"); return; }
    if (form.new_password.length < 6) { setPwError("Password must be at least 6 characters"); return; }
    try {
      await saveMutation.mutateAsync({ current_password: form.current_password, new_password: form.new_password });
      setForm((f) => ({ ...f, current_password: "", new_password: "", confirm_password: "" }));
    } catch (e: any) { setPwError(e.message); }
  }

  if (!verified) return null;

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {saved && (
          <div className="bg-[#39efd0]/10 border border-[#39efd0]/20 text-[#39efd0] text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            ✓ Settings saved successfully
          </div>
        )}

        <form onSubmit={handleSaveGeneral}>
          <Section title="Site Identity" description="Basic information about your store">
            <Field label="Site Name">
              <input value={form.site_name} onChange={(e) => set("site_name", e.target.value)} placeholder="Bundly+" className={INPUT} data-testid="input-site-name" />
            </Field>
          </Section>
          <div className="mt-4" />
          <Section title="Hero Section" description="The headline text shown at the top of the homepage">
            <Field label="Main Title" hint="Use \\n for a line break">
              <textarea value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} rows={2} placeholder="Stream More,\nPay Less." className={`${INPUT} resize-none`} data-testid="textarea-hero-title" />
            </Field>
            <Field label="Subtitle">
              <input value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} placeholder="Premium subscriptions at unbeatable prices…" className={INPUT} data-testid="input-hero-subtitle" />
            </Field>
            <Field label="CTA Button Text">
              <input value={form.hero_cta} onChange={(e) => set("hero_cta", e.target.value)} placeholder="Browse All Plans" className={INPUT} data-testid="input-hero-cta" />
            </Field>
          </Section>
          <div className="mt-4" />
          <Section title="WhatsApp" description="Customer orders are sent to this WhatsApp number">
            <Field label="WhatsApp Number" hint="Include country code, e.g. 96176171003">
              <input value={form.whatsapp_number} onChange={(e) => set("whatsapp_number", e.target.value)} placeholder="96176171003" className={INPUT} data-testid="input-whatsapp-number" />
            </Field>
          </Section>
          <div className="mt-4">
            <button type="submit" disabled={saveMutation.isPending} data-testid="button-save-settings" className="flex items-center gap-2 bg-[#ff7a4d] hover:bg-orange-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">
              <Save size={15} /> {saveMutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

        <form onSubmit={handleSavePassword}>
          <Section title="Change Password" description="Update your admin login password">
            <Field label="Current Password">
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} value={form.current_password} onChange={(e) => set("current_password", e.target.value)} placeholder="Current password" className={`${INPUT} pr-10`} data-testid="input-current-password" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
            <Field label="New Password">
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={form.new_password} onChange={(e) => set("new_password", e.target.value)} placeholder="New password (min 6 chars)" className={`${INPUT} pr-10`} data-testid="input-new-password" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm New Password">
              <input type="password" value={form.confirm_password} onChange={(e) => set("confirm_password", e.target.value)} placeholder="Repeat new password" className={INPUT} data-testid="input-confirm-password" />
            </Field>
            {pwError && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{pwError}</p>}
            <button type="submit" disabled={saveMutation.isPending} data-testid="button-change-password" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition">
              <Save size={15} /> {saveMutation.isPending ? "Saving…" : "Change Password"}
            </button>
          </Section>
        </form>
      </div>
    </AdminLayout>
  );
}
