"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/nastenka";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Zadejte platný e-mail.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), redirect }),
      });
      setStatus("sent");
    } catch {
      setErrorMsg("Něco se pokazilo. Zkuste to prosím znovu.");
      setStatus("idle");
    }
  };

  // Error from verification
  const verifyError =
    error === "expired"
      ? "Odkaz vypršel. Požádejte o nový."
      : error === "invalid"
        ? "Neplatný odkaz. Požádejte o nový."
        : error === "unknown"
          ? "Něco se pokazilo. Zkuste to prosím znovu."
          : "";

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md w-full">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold tracking-wider text-gold-gradient leading-tight mb-6">
          Ve Žluté
        </h1>

        <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic leading-relaxed mb-8">
          &bdquo;Večer oděný tajemstvím čeká na vyvolené.&ldquo;
        </p>

        <div className="flex items-center gap-3 w-48 mx-auto mb-8">
          <div className="flex-1 h-px bg-gold/40" />
          <div className="w-2 h-2 rotate-45 border border-gold/60" />
          <div className="flex-1 h-px bg-gold/40" />
        </div>

        {status === "sent" ? (
          <div className="space-y-4">
            <div className="p-6 border border-gold/30 bg-gold/5">
              <p className="font-[family-name:var(--font-body)] text-body text-lg mb-3">
                ✉️ Zkontrolujte svůj e-mail
              </p>
              <p className="font-[family-name:var(--font-body)] text-muted text-sm leading-relaxed">
                Na adresu <span className="text-gold">{email}</span> jsme
                odeslali odkaz pro přihlášení.
                <br />
                Platí 15 minut.
              </p>
            </div>

            <button
              onClick={() => {
                setStatus("idle");
                setEmail("");
              }}
              className="text-muted hover:text-gold font-[family-name:var(--font-body)] text-sm transition-colors cursor-pointer"
            >
              Použít jiný e-mail
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="váš@email.cz"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg("");
              }}
              autoFocus
              autoComplete="email"
              className="w-full px-4 py-3 bg-gold/5 border border-gold/30 focus:border-gold/60 outline-none text-body font-[family-name:var(--font-body)] text-lg text-center placeholder:text-body/40"
            />

            {(errorMsg || verifyError) && (
              <p className="text-red-400/80 font-[family-name:var(--font-body)] text-sm">
                {errorMsg || verifyError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3 bg-gold/10 border border-gold/50 hover:bg-gold/15 hover:border-gold text-gold font-[family-name:var(--font-display)] text-sm tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {status === "sending" ? "Odesílám…" : "Získat odkaz"}
            </button>
          </form>
        )}

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
