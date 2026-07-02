"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PokladnaContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  }, [orderId]);

  const handleSimulate = async () => {
    if (!orderId) return;
    setSimulating(true);
    await fetch(`/api/orders/${orderId}/simulate-payment`, { method: "POST" });
    setOrder({ ...order, status: "CONFIRMED" });
    setSimulating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Objednávka nenalezena.</p></div>;

  const ticketLabel = order.ticketType === "COUPLE" ? "Párový" : order.ticketType === "EARLY_BIRD" ? "Early Bird" : "Běžný";

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight mb-4">
          {order.status === "CONFIRMED" ? "Zaplaceno" : "Pokladna"}
        </h1>

        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <div className="border border-gold/30 p-6 space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-muted font-[family-name:var(--font-body)] text-sm">Typ</span>
            <span className="text-gold font-[family-name:var(--font-display)]">{ticketLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted font-[family-name:var(--font-body)] text-sm">Variabilní symbol</span>
            <span className="text-body font-mono">{order.variableSymbol}</span>
          </div>
          <div className="flex justify-between border-t border-gold/20 pt-4">
            <span className="text-muted font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase">Celkem</span>
            <span className="text-gold font-[family-name:var(--font-display)] text-2xl">{order.amount} Kč</span>
          </div>
        </div>

        {order.status === "PENDING" && (
          <>
            {/* Placeholder payment QR — real QR in Phase 4 */}
            <div className="border border-gold/20 p-6 mb-6">
              <div className="w-48 h-48 mx-auto bg-gold/5 border border-gold/30 flex items-center justify-center mb-3">
                <span className="text-muted text-xs text-center font-[family-name:var(--font-body)]">
                  QR PLATBA<br />(fáze 4)
                </span>
              </div>
              <p className="text-muted text-xs font-[family-name:var(--font-body)] italic">
                Naskenujte QR kód ve své bankovní aplikaci pro provedení platby.
              </p>
            </div>

            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="w-full py-3 bg-gold/20 border border-gold/50 hover:bg-gold/30 text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all mb-4"
            >
              {simulating ? "Simuluji…" : "Simulovat platbu"}
            </button>
            <p className="text-muted/50 text-xs italic">Toto tlačítko je pouze pro validaci — v reálné verzi zmizí.</p>
          </>
        )}

        {order.status === "CONFIRMED" && (
          <Link
            href={`/vstupenky/muj-listek?id=${order.id}`}
            className="inline-block w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase transition-colors"
          >
            Zobrazit lístek
          </Link>
        )}

        <div className="flex items-center gap-3 w-48 mx-auto mt-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <Link href="/vstupenky" className="inline-block mt-6 text-gold text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors">
          &larr; Zpět na výběr
        </Link>
      </div>
    </div>
  );
}

export default function PokladnaPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted">…</p></div>}><PokladnaContent /></Suspense>;
}
