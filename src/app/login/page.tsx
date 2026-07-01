"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Vstup zatím není aktivní.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold tracking-wider text-gold-gradient leading-tight mb-6">
          Ve Žluté
        </h1>

        <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic leading-relaxed mb-8">
          „Večer oděný tajemstvím čeká na vyvolené.&quot;
        </p>

        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Jméno"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
          />
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 hover:border-gold text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all duration-300"
          >
            Vstupte
          </button>
        </form>

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
