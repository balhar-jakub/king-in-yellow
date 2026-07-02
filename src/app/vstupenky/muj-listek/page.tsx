"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function TicketContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Objednávka nenalezena.</p></div>;
  if (order.status !== "CONFIRMED") return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Lístek zatím není k dispozici — čeká na potvrzení platby.</p></div>;

  const ticketLabel = order.ticketType === "COUPLE" ? "Párový" : order.ticketType === "EARLY_BIRD" ? "Early Bird" : "Běžný";
  const dateStr = "20. 2. 2027, 20:00";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0a]">
      {/* Ticket card — visually styled */}
      <div className="relative w-full max-w-lg">
        {/* Outer ornate frame */}
        <div className="border border-gold/40 p-1">
          <div className="border border-gold/30 p-1">
            <div className="border border-gold/50 p-8 bg-[#0e0e0e]">

              {/* Corner diamonds */}
              <div className="absolute top-3 left-3 w-3 h-3 rotate-45 border border-gold/60" />
              <div className="absolute top-3 right-3 w-3 h-3 rotate-45 border border-gold/60" />
              <div className="absolute bottom-3 left-3 w-3 h-3 rotate-45 border border-gold/60" />
              <div className="absolute bottom-3 right-3 w-3 h-3 rotate-45 border border-gold/60" />

              <div className="text-center space-y-6">
                {/* Header */}
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight">
                    Ve Žluté
                  </h1>
                  <p className="font-[family-name:var(--font-body)] text-muted italic text-sm mt-1">{dateStr}</p>
                  <p className="font-[family-name:var(--font-body)] text-muted/70 text-xs">Plzeň</p>
                </div>

                <div className="flex items-center gap-3 w-32 mx-auto">
                  <div className="flex-1 h-px bg-gold/40" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-gold/60" />
                  <div className="flex-1 h-px bg-gold/40" />
                </div>

                {/* Ticket details */}
                <div className="space-y-3">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted">Typ vstupenky</p>
                    <p className="font-[family-name:var(--font-display)] text-xl text-gold">{ticketLabel}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted">Číslo vstupenky</p>
                    <p className="font-mono text-sm text-body">{order.id}</p>
                  </div>
                  {order.guestName && (
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted">Host</p>
                      <p className="font-[family-name:var(--font-body)] text-body">{order.guestName}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-32 mx-auto">
                  <div className="flex-1 h-px bg-gold/40" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-gold/60" />
                  <div className="flex-1 h-px bg-gold/40" />
                </div>

                {/* Entry QR placeholder */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 bg-gold/5 border border-gold/30 flex items-center justify-center">
                    <span className="text-muted text-[10px] text-center font-[family-name:var(--font-body)] leading-tight">
                      VSTUPNÍ<br />QR KÓD<br />(fáze 4)
                    </span>
                  </div>
                </div>

                <p className="font-[family-name:var(--font-body)] text-xs text-muted/60 italic">
                  Tento lístek je nepřenosný. Předložte u vstupu.
                </p>

                {/* Bottom ornament */}
                <p className="font-[family-name:var(--font-body)] text-muted/40 text-[10px] tracking-widest">✦ ✦ ✦</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MujListekPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>}><TicketContent /></Suspense>;
}
