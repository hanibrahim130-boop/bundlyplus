import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, Settings, ExternalLink, LogOut, ChevronRight } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const [location, navigate] = useLocation();

  function logout() {
    localStorage.removeItem("bundlyplus-admin-token");
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex">
      <aside className="fixed top-0 left-0 h-full w-60 bg-[#111111] border-r border-white/[0.06] flex flex-col z-40">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <span style={{ fontFamily: "var(--font-syne)" }} className="text-lg font-black text-white">
            BUNDLY<span className="text-[#ff7a4d]">+</span>
          </span>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? location === href : location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <a
                  data-testid={`nav-admin-${label.toLowerCase()}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-[#ff7a4d]/15 text-[#ff7a4d]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} />
            View Site
          </a>
          <button
            onClick={logout}
            data-testid="button-admin-logout"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 min-h-screen">
        <div className="border-b border-white/[0.06] bg-[#111111] px-8 py-4 sticky top-0 z-30">
          <h1 style={{ fontFamily: "var(--font-syne)" }} className="text-base font-bold text-white">{title}</h1>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
