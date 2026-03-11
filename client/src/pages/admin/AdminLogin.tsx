import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("bundlyplus-admin-token", data.token);
      navigate("/admin");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0f0f0f] flex items-center justify-center p-4" style={{ minHeight: "100dvh" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span style={{ fontFamily: "var(--font-syne)" }} className="text-2xl font-black text-white">
              BUNDLY<span className="text-[#ff7a4d]">+</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">Admin Dashboard</p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8">
          <h1 className="text-lg font-bold text-white mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-testid="input-admin-password"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#ff7a4d]/60 focus:ring-1 focus:ring-[#ff7a4d]/30 transition"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              data-testid="button-admin-login"
              disabled={loading}
              className="w-full bg-[#ff7a4d] hover:bg-orange-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="text-center text-xs text-slate-600 mt-4">Default password: <span className="text-slate-400">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
