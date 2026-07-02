"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setForm({ name: data.name || "", phone: data.phone || "", street: data.street || "", city: data.city || "", zip: data.zip || "" });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { router.push("/vstupenky"); }, 1000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted font-[family-name:var(--font-body)]">…</p></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight mb-3">
          Váš profil
        </h1>
        <p className="font-[family-name:var(--font-body)] text-base text-muted italic mb-6">
          Pro dokončení objednávky potřebujeme pár údajů.
        </p>

        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        {saved ? (
          <div className="border border-gold/30 p-6 bg-gold/5">
            <p className="text-gold font-[family-name:var(--font-body)] text-lg">✓ Uloženo</p>
            <p className="text-muted text-sm mt-1">Přesměrováváme na výběr vstupenek…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" required placeholder="Jméno a příjmení" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
            />
            <input
              type="tel" required placeholder="Telefon (+420 …)" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
            />
            <input
              type="text" required placeholder="Ulice a číslo" value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
            />
            <div className="flex gap-4">
              <input
                type="text" required placeholder="Město" value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="flex-1 px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
              />
              <input
                type="text" required placeholder="PSČ" value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="w-32 px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
              />
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 hover:border-gold text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 disabled:opacity-50"
            >
              {saving ? "Ukládám…" : "Pokračovat"}
            </button>
          </form>
        )}

        <div className="flex items-center gap-3 w-48 mx-auto mt-8">
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
