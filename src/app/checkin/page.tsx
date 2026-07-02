"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckinPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setScanning(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code.trim() }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error === "Already checked in" ? "Tento lístek byl již odbaven." : "Neplatný kód lístku.");
    } else {
      setResult(data.ticket);
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight mb-3">
          Odbavení
        </h1>
        <p className="font-[family-name:var(--font-body)] text-muted italic mb-6">
          Naskenujte nebo zadejte kód vstupenky.
        </p>

        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          <input
            type="text"
            placeholder="Zadejte kód (např. ticket-001)"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); setResult(null); }}
            autoFocus
            className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-mono text-lg text-center placeholder:text-body/40"
          />

          <button
            type="submit"
            disabled={scanning || !code.trim()}
            className="w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 hover:border-gold text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all disabled:opacity-50"
          >
            {scanning ? "Ověřuji…" : "Ověřit lístek"}
          </button>
        </form>

        {error && (
          <div className="mt-6 border border-red-400/30 p-4 bg-red-400/5">
            <p className="text-red-400/80 font-[family-name:var(--font-body)] text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 border border-green-400/30 p-6 bg-green-400/5 text-left">
            <p className="text-green-400/80 font-[family-name:var(--font-display)] text-sm tracking-[0.15em] uppercase mb-3">✓ Odbaveno</p>
            <div className="space-y-2 text-sm text-body">
              <p><span className="text-muted">ID:</span> <span className="font-mono">{result.id}</span></p>
              <p><span className="text-muted">Typ:</span> {result.ticketType}</p>
              {result.guestName && <p><span className="text-muted">Host:</span> {result.guestName}</p>}
              <p><span className="text-muted">Stav:</span> <span className="text-green-400/80">{result.status}</span></p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 w-48 mx-auto mt-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <Link href="/" className="inline-block mt-6 text-gold text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors">
          &larr; Zpět
        </Link>

        <p className="text-muted/40 text-xs mt-8 font-[family-name:var(--font-body)] italic">
          Mock check-in — akceptuje kódy začínající na &quot;ticket-&quot;. Fáze 6 bude ověřovat reálné tokeny.
        </p>
      </div>
    </div>
  );
}
