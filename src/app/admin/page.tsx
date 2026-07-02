"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Čeká na platbu",
  CONFIRMED: "Zaplaceno",
  CHECKED_IN: "Odbaveno",
};

const TYPE_LABELS: Record<string, string> = {
  EARLY_BIRD: "Early Bird",
  REGULAR: "Běžný",
  COUPLE: "Párový",
};

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleConfirm = async (id: string) => {
    await fetch(`/api/admin/orders/${id}/confirm`, { method: "POST" });
    fetchOrders();
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-wider text-gold-gradient">Administrace</h1>
          <p className="font-[family-name:var(--font-body)] text-muted text-sm mt-1">Správa objednávek a plateb.</p>
        </div>
        <Link href="/" className="text-gold text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors">&larr; Zpět</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["ALL", "PENDING", "CONFIRMED", "CHECKED_IN"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-colors ${
              filter === f ? "border-gold bg-gold/10 text-gold" : "border-gold/20 text-muted hover:border-gold/40"
            }`}
          >
            {f === "ALL" ? "Vše" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-muted text-center py-8 font-[family-name:var(--font-body)]">Žádné objednávky.</p>}
        {filtered.map((order) => (
          <div key={order.id} className="border border-gold/20 p-4 hover:border-gold/30 transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-[family-name:var(--font-display)] text-gold text-sm">{order.userName || "Neznámý"}</p>
                <p className="text-muted text-xs font-mono">{order.id}</p>
                <div className="flex gap-3 text-xs text-body/60">
                  <span>{TYPE_LABELS[order.ticketType] || order.ticketType}</span>
                  <span>·</span>
                  <span className="text-gold">{order.amount} Kč</span>
                  <span>·</span>
                  <span className={order.status === "CONFIRMED" ? "text-green-400/80" : order.status === "CHECKED_IN" ? "text-blue-400/80" : "text-yellow-400/80"}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleConfirm(order.id)}
                    className="px-4 py-1.5 bg-gold/10 border border-gold/40 hover:bg-gold/20 text-gold text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors"
                  >
                    Potvrdit platbu
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-muted/40 text-xs text-center mt-8 font-[family-name:var(--font-body)] italic">
        Mock admin — data z paměti. Fáze 5 bude napojena na databázi.
      </p>
    </div>
  );
}
