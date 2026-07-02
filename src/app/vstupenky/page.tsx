"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TICKETS: { type: string; label: string; price: number; description: string; deadline?: string; max?: number; isCouple?: boolean }[] = [
  {
    type: "EARLY_BIRD",
    label: "Early Bird",
    price: 777,
    description: "Brány Žlutého království se otevírají pro první z odvážných.",
    deadline: "2026-09-30",
    max: 50,
  },
  {
    type: "REGULAR",
    label: "Běžný",
    price: 888,
    description: "Vstupte do světa, kde realita nosí žlutý závoj. Pro jednoho odvážlivce.",
  },
  {
    type: "COUPLE",
    label: "Párový",
    price: 1776,
    description: "Dva osudy spoutané žlutou nití. Vstup pro dva.",
    isCouple: true,
  },
];

export default function VstupenkyPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrder(data.id ? data : null); setLoading(false); });
  }, []);

  const handleSelect = async (ticketType: string) => {
    setCreating(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketType }),
    });
    const data = await res.json();
    if (data.id) router.push(`/vstupenky/pokladna?id=${data.id}`);
    setCreating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>;

  // Already has an order
  if (order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md w-full">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-gold-gradient mb-4">Již máte objednávku</h1>
          <p className="text-muted font-[family-name:var(--font-body)] mb-6">Každý profil může mít pouze jednu objednávku.</p>
          <div className="border border-gold/30 p-6 space-y-3">
            <p className="text-gold font-[family-name:var(--font-display)] text-lg">{order.ticketType === "COUPLE" ? "Párový" : order.ticketType === "EARLY_BIRD" ? "Early Bird" : "Běžný"}</p>
            <p className="text-body font-[family-name:var(--font-body)] text-2xl">{order.amount} Kč</p>
            <p className="text-muted text-sm">Stav: {order.status === "PENDING" ? "Čeká na platbu" : order.status === "CONFIRMED" ? "Zaplaceno" : "Odbaveno"}</p>
            {order.status === "PENDING" && (
              <Link href={`/vstupenky/pokladna?id=${order.id}`} className="inline-block px-6 py-2 bg-gold/10 border border-gold/50 text-gold text-sm tracking-[0.2em] uppercase hover:bg-gold/15 transition-colors">
                Dokončit platbu
              </Link>
            )}
            {order.status === "CONFIRMED" && (
              <Link href={`/vstupenky/muj-listek?id=${order.id}`} className="inline-block px-6 py-2 bg-gold/10 border border-gold/50 text-gold text-sm tracking-[0.2em] uppercase hover:bg-gold/15 transition-colors">
                Zobrazit lístek
              </Link>
            )}
          </div>
          <Link href="/" className="inline-block mt-8 text-gold text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors">&larr; Zpět</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl w-full">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold tracking-wider text-gold-gradient leading-tight mb-3">
          Vstupenky
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-muted italic mb-8">
          &bdquo;Každý krok do žlutého světla má svou cenu.&ldquo;
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TICKETS.map((ticket) => {
            const isPast = "deadline" in ticket && ticket.deadline && new Date(ticket.deadline) < new Date();
            const unavailable = ticket.type === "EARLY_BIRD" && isPast; // simplified: in Phase 3 check capacity too
            return (
              <div key={ticket.type} className={`border p-6 flex flex-col items-center ${unavailable ? "border-gold/10 opacity-40" : "border-gold/30 hover:border-gold/50 transition-colors"}`}>
                <p className="font-[family-name:var(--font-display)] text-xl text-gold mb-2">{ticket.label}</p>
                <p className="font-[family-name:var(--font-body)] text-3xl text-gold-light mb-1">{ticket.price} Kč</p>
                <p className="font-[family-name:var(--font-body)] text-sm text-muted italic mb-4 leading-relaxed">{ticket.description}</p>
                {ticket.deadline && <p className="text-xs text-muted/60 mb-3">Do {new Date(ticket.deadline).toLocaleDateString("cs")}</p>}
                <button
                  disabled={unavailable || creating}
                  onClick={() => handleSelect(ticket.type)}
                  className="mt-auto w-full py-2 bg-gold/10 border border-gold/50 hover:bg-gold/15 text-gold font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {unavailable ? "Vyprodáno" : creating ? "…" : "Vybrat"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-48 mx-auto mt-10">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <Link href="/" className="inline-block mt-6 text-gold font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors">
          &larr; Zpět
        </Link>
      </div>
    </div>
  );
}
