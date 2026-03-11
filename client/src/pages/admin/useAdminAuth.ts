import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("bundlyplus-admin-token");
    if (!token) { setVerified(false); navigate("/admin/login"); return; }
    fetch("/api/admin/verify", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.ok) setVerified(true);
        else { localStorage.removeItem("bundlyplus-admin-token"); setVerified(false); navigate("/admin/login"); }
      })
      .catch(() => { setVerified(false); navigate("/admin/login"); });
  }, []);

  return { verified, token: localStorage.getItem("bundlyplus-admin-token") ?? "" };
}

export function adminFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("bundlyplus-admin-token") ?? "";
  return fetch(url, { ...options, headers: { ...(options.headers ?? {}), Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
}
