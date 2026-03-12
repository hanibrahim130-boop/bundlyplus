import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Package, Flame, Tag, Plus, Settings } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useAdminAuth, adminFetch } from "./useAdminAuth";
import type { Product } from "@shared/schema";

export default function AdminDashboard() {
  const { verified } = useAdminAuth();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: () => adminFetch("/api/admin/products").then((r) => r.json()),
    enabled: !!verified,
  });

  if (!verified) return null;

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const hotCount = products.filter((p) => p.hot).length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-[#2bfdc8]", bg: "bg-[#2bfdc8]/10" },
    { label: "Categories", value: categories.length, icon: Tag, color: "text-[#fb7246]", bg: "bg-[#fb7246]/10" },
    { label: "Hot Items", value: hotCount, icon: Flame, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">{label}</span>
                <span className={`${bg} ${color} p-2 rounded-lg`}><Icon size={16} /></span>
              </div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/products">
            <a className="flex items-center gap-4 bg-[#141414] border border-white/[0.06] hover:border-[#fb7246]/30 rounded-2xl p-5 transition group">
              <span className="bg-[#fb7246]/10 text-[#fb7246] p-3 rounded-xl"><Plus size={20} /></span>
              <div>
                <p className="font-semibold text-white group-hover:text-[#fb7246] transition">Add Product</p>
                <p className="text-xs text-slate-500">Create a new subscription listing</p>
              </div>
            </a>
          </Link>
          <Link href="/admin/settings">
            <a className="flex items-center gap-4 bg-[#141414] border border-white/[0.06] hover:border-[#2bfdc8]/30 rounded-2xl p-5 transition group">
              <span className="bg-[#2bfdc8]/10 text-[#2bfdc8] p-3 rounded-xl"><Settings size={20} /></span>
              <div>
                <p className="font-semibold text-white group-hover:text-[#2bfdc8] transition">Site Settings</p>
                <p className="text-xs text-slate-500">Edit hero, WhatsApp, and more</p>
              </div>
            </a>
          </Link>
        </div>

        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">All Products</h2>
            <Link href="/admin/products">
              <a className="text-xs text-[#fb7246] hover:underline">Manage →</a>
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center px-5 py-3 gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-white/50">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-sm text-white truncate">{p.name}</span>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{p.category}</span>
                <span className="text-sm font-semibold text-[#2bfdc8]">${p.price.toFixed(2)}</span>
                {p.hot && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">🔥 Hot</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
