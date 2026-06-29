"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoteriePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tickets, setTickets] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const pricePerTicket = 100;
  const total = tickets * pricePerTicket;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md w-full">
          {/* Ornament */}
          <div className="flex items-center gap-3 w-48 mx-auto mb-8">
            <div className="flex-1 h-px bg-gold/40" />
            <div className="w-2 h-2 rotate-45 border border-gold/60" />
            <div className="flex-1 h-px bg-gold/40" />
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight mb-4">
            Losováno osudem
          </h1>

          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic leading-relaxed mb-2">
            Děkujeme, {name || "vyvolený"}.
          </p>
          <p className="font-[family-name:var(--font-body)] text-base text-muted italic leading-relaxed mb-8">
            Vaše žádost o {tickets}{" "}
            {tickets === 1 ? "lístek" : tickets < 5 ? "lístky" : "lístků"} byla
            zapsána do Knihy osudů.
          </p>

          <div className="border border-gold/30 p-6 mb-8">
            <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase text-muted mb-2">
              Částka k úhradě
            </p>
            <p className="font-[family-name:var(--font-display)] text-3xl text-gold">
              {total} Kč
            </p>
            <p className="font-[family-name:var(--font-body)] text-sm text-muted italic mt-2">
              Platební pokyny vám zašleme na {email}
            </p>
          </div>

          <div className="flex items-center gap-3 w-48 mx-auto mb-8">
            <div className="flex-1 h-px bg-gold/40" />
            <div className="w-2 h-2 rotate-45 border border-gold/60" />
            <div className="flex-1 h-px bg-gold/40" />
          </div>

          <Link
            href="/"
            className="inline-block text-gold font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors"
          >
            &larr; Zpět
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold tracking-wider text-gold-gradient leading-tight mb-3">
          Loterie
        </h1>

        <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic leading-relaxed mb-2">
          „Štěstí je stín, jenž ve žlutém světle tančí.&quot;
        </p>

        <p className="font-[family-name:var(--font-body)] text-sm text-muted/70 mb-6">
          Cena lístku: {pricePerTicket} Kč &nbsp;·&nbsp; 20. 2. 2027
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted mb-2 text-center">
              Jméno a příjmení
            </label>
            <input
              type="text"
              required
              placeholder="Vaše jméno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40 transition-colors"
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted mb-2 text-center">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40 transition-colors"
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted mb-2 text-center">
              Telefon (nepovinné)
            </label>
            <input
              type="tel"
              placeholder="+420 ..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40 transition-colors"
            />
          </div>

          <div>
            <label className="block font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted mb-2 text-center">
              Počet lístků
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setTickets(Math.max(1, tickets - 1))}
                className="w-10 h-10 border border-gold/40 hover:border-gold/70 text-gold font-[family-name:var(--font-display)] text-xl transition-colors"
              >
                −
              </button>
              <span className="font-[family-name:var(--font-display)] text-2xl text-gold w-12 tabular-nums">
                {tickets}
              </span>
              <button
                type="button"
                onClick={() => setTickets(Math.min(99, tickets + 1))}
                className="w-10 h-10 border border-gold/40 hover:border-gold/70 text-gold font-[family-name:var(--font-display)] text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="border border-gold/20 p-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-muted">
                Celkem
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl text-gold tabular-nums">
                {total} Kč
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full pt-4">
            <div className="flex-1 h-px bg-gold/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
            <div className="flex-1 h-px bg-gold/30" />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 hover:border-gold text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all duration-300"
          >
            Objednat lístky
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-48 mx-auto mt-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <Link
          href="/"
          className="inline-block mt-6 text-gold font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase hover:text-gold-light transition-colors"
        >
          &larr; Zpět
        </Link>
      </div>
    </div>
  );
}
