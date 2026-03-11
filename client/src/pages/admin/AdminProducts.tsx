import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, Flame, Search, X } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useAdminAuth, adminFetch } from "./useAdminAuth";
import type { Product } from "@shared/schema";

const CATEGORIES = ["Streaming", "Music & Others", "Software & AI", "Gaming"];
const ACCOUNT_TYPES = ["Shared", "Private"];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ProductForm = {
  id: string; name: string; category: string; price: string;
  description: string; features: string; image_url: string;
  account_type: string; hot: boolean;
};

const EMPTY_FORM: ProductForm = {
  id: "", name: "", category: "Streaming", price: "",
  description: "", features: "", image_url: "", account_type: "Shared", hot: false,
};

function ProductSheet({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (data: any) => void }) {
  const isNew = !product;
  const [form, setForm] = useState<ProductForm>(
    product
      ? { ...product, price: product.price.toString(), features: product.features.join("\n") }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof ProductForm, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "name" && isNew) setForm((f) => ({ ...f, name: value, id: slugify(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const payload = { ...form, price: parseFloat(form.price) || 0, features: form.features.split("\n").map((s) => s.trim()).filter(Boolean) };
      await onSave(payload);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#111] border-l border-white/10 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#111] z-10">
          <h2 style={{ fontFamily: "var(--font-syne)" }} className="font-bold text-white">{isNew ? "Add Product" : "Edit Product"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" className="col-span-2">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Netflix Premium" required className={INPUT} data-testid="input-product-name" />
            </Field>
            <Field label="URL Slug / ID *">
              <input value={form.id} onChange={(e) => set("id", e.target.value)} placeholder="netflix" required disabled={!isNew} className={`${INPUT} ${!isNew ? "opacity-50 cursor-not-allowed" : ""}`} data-testid="input-product-id" />
            </Field>
            <Field label="Price ($/mo) *">
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="3.99" required className={INPUT} data-testid="input-product-price" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={SELECT} data-testid="select-product-category">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Account Type">
              <select value={form.account_type} onChange={(e) => set("account_type", e.target.value)} className={SELECT} data-testid="select-product-account-type">
                {ACCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Short description of the subscription…" className={`${INPUT} resize-none`} data-testid="textarea-product-description" />
          </Field>

          <Field label="Features (one per line)">
            <textarea value={form.features} onChange={(e) => set("features", e.target.value)} rows={4} placeholder={"4K Ultra HD streaming\n4 simultaneous screens\nDownload for offline"} className={`${INPUT} resize-none font-mono text-xs`} data-testid="textarea-product-features" />
          </Field>

          <Field label="Image URL">
            <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." className={INPUT} data-testid="input-product-image-url" />
          </Field>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("hot", !form.hot)}
              data-testid="toggle-product-hot"
              className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${form.hot ? "bg-[#ff7a4d]" : "bg-white/10"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.hot ? "translate-x-4" : ""}`} />
            </div>
            <span className="text-sm text-slate-300">Mark as <span className="text-yellow-400">🔥 Hot</span></span>
          </label>

          {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
        </form>

        <div className="px-6 py-5 border-t border-white/10 sticky bottom-0 bg-[#111] flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white hover:border-white/25 py-2.5 rounded-xl text-sm transition">Cancel</button>
          <button onClick={handleSubmit as any} disabled={saving} data-testid="button-save-product" className="flex-1 bg-[#ff7a4d] hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
            {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const INPUT = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#ff7a4d]/60 focus:ring-1 focus:ring-[#ff7a4d]/20 transition";
const SELECT = "w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7a4d]/60 focus:ring-1 focus:ring-[#ff7a4d]/20 transition";

export default function AdminProducts() {
  const { verified } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: () => adminFetch("/api/admin/products").then((r) => r.json()),
    enabled: !!verified,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(data) }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => adminFetch(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(async (r) => { if (!r.ok) throw new Error((await r.json()).error || "Failed"); return r.json(); }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminFetch(`/api/admin/products/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }); setDeleteConfirm(null); },
  });

  const hotMutation = useMutation({
    mutationFn: ({ id, hot }: { id: string; hot: boolean }) => adminFetch(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify({ hot }) }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] }),
  });

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  if (!verified) return null;

  async function handleSave(data: any) {
    if (editing === "new") await createMutation.mutateAsync(data);
    else await updateMutation.mutateAsync({ id: (editing as Product).id, ...data });
  }

  return (
    <AdminLayout title="Products">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              data-testid="input-search-products"
              className="w-full bg-[#141414] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff7a4d]/60 focus:ring-1 focus:ring-[#ff7a4d]/20 transition"
            />
          </div>
          <button onClick={() => setEditing("new")} data-testid="button-add-product" className="flex items-center gap-2 bg-[#ff7a4d] hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)} data-testid={`filter-${c.toLowerCase().replace(/\s/g, "-")}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${categoryFilter === c ? "bg-[#ff7a4d] text-white" : "bg-white/5 text-slate-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_130px_90px_80px_80px_96px] text-xs font-medium text-slate-500 px-5 py-3 border-b border-white/[0.06] uppercase tracking-wider">
            <span>Product</span><span>Category</span><span>Price</span><span>Type</span><span>Hot</span><span className="text-right">Actions</span>
          </div>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No products found.</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((p) => (
                <div key={p.id} data-testid={`row-product-${p.id}`} className="grid grid-cols-[1fr_130px_90px_80px_80px_96px] items-center px-5 py-3 hover:bg-white/[0.02] transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-white/50">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.id}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full w-fit">{p.category}</span>
                  <span className="text-sm font-semibold text-[#39efd0]">${p.price.toFixed(2)}/mo</span>
                  <span className={`text-xs px-2 py-1 rounded-full w-fit ${p.account_type === "Private" ? "bg-purple-400/10 text-purple-400" : "bg-blue-400/10 text-blue-400"}`}>{p.account_type}</span>
                  <div>
                    <button
                      onClick={() => hotMutation.mutate({ id: p.id, hot: !p.hot })}
                      data-testid={`toggle-hot-${p.id}`}
                      className={`w-9 h-5 rounded-full transition-all flex items-center px-0.5 ${p.hot ? "bg-[#ff7a4d]" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${p.hot ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <button onClick={() => setEditing(p)} data-testid={`button-edit-${p.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteConfirm(p)} data-testid={`button-delete-${p.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-slate-600 text-right">{filtered.length} of {products.length} products</p>
      </div>

      {(editing !== null) && (
        <ProductSheet
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-400" />
            </div>
            <h3 className="font-bold text-white mb-1">Delete Product?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteConfirm.name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-white/10 text-slate-400 hover:text-white py-2.5 rounded-xl text-sm transition">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteConfirm.id)} data-testid="button-confirm-delete" disabled={deleteMutation.isPending} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition">
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
