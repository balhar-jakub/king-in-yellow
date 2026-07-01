"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TARGET_DATE = new Date("2027-02-20T20:00:00+01:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    function tick() {
      const diff = TARGET_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: pad(Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: pad(Math.floor((diff / (1000 * 60)) % 60)),
        seconds: pad(Math.floor((diff / 1000) % 60)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days, label: "Dní" },
    { value: time.hours, label: "Hodin" },
    { value: time.minutes, label: "Minut" },
    { value: time.seconds, label: "Sekund" },
  ] as const;

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-gold/40">
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-gold tabular-nums">
                {unit.value}
              </span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gold/60" />
          </div>
          <span className="mt-3 text-xs md:text-sm tracking-[0.2em] uppercase text-muted font-[family-name:var(--font-body)]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Divider({ wide }: { wide?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${wide ? "w-full max-w-xs" : ""}`}>
      <div className={`${wide ? "flex-1" : "w-12"} h-px bg-gold/40`} />
      <div className={`w-2 h-2 rotate-45 ${wide ? "bg-gold/50" : "border border-gold/60"}`} />
      <div className={`${wide ? "flex-1" : "w-12"} h-px bg-gold/40`} />
    </div>
  );
}

function Corner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  }[position];

  const diamondClass = {
    tl: "top-3 left-3 border-t border-l",
    tr: "top-3 right-3 border-t border-r",
    bl: "bottom-3 left-3 border-b border-l",
    br: "bottom-3 right-3 border-b border-r",
  }[position];

  const isTop = position.startsWith("t");
  const isLeft = position.endsWith("l");

  return (
    <div className={`absolute w-8 h-8 ${posClass}`}>
      {/* Outer frame arms */}
      <div
        className="absolute bg-gold"
        style={{
          top: 0,
          [isLeft ? "left" : "right"]: 0,
          width: "100%",
          height: "1px",
        }}
      />
      <div
        className="absolute bg-gold"
        style={{
          top: 0,
          [isLeft ? "left" : "right"]: 0,
          width: "1px",
          height: "100%",
        }}
      />
      {/* Inner diamond */}
      <div
        className={`absolute w-3 h-3 rotate-45 border-gold/70 ${diamondClass}`}
        style={{
          [isTop ? "top" : "bottom"]: "0.75rem",
          [isLeft ? "left" : "right"]: "0.75rem",
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fog layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 animate-fog opacity-30"
          style={{
            background:
              "radial-gradient(at 20% 50%, rgba(221, 173, 49, 0.06) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 animate-fog-reverse opacity-20"
          style={{
            background:
              "radial-gradient(at 80% 30%, rgba(221, 173, 49, 0.04) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Vertical accent lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent via-gold/30 to-transparent" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-16">
        <div className="relative">
          {/* Frame borders */}
          <div className="absolute inset-0 border border-gold/30" />
          <div className="absolute inset-3 border border-gold/50" />

          {/* Corner decorations */}
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />

          {/* Content */}
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-8">
              <Divider />

              <div className="space-y-2">
                <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-semibold tracking-wider text-gold-gradient leading-tight">
                  Ve Žluté
                </h1>
                <p className="font-[family-name:var(--font-body)] text-lg md:text-xl italic text-muted tracking-widest">
                  In Yellow
                </p>
              </div>

              <Divider wide />

              <p className="font-[family-name:var(--font-display)] text-sm md:text-base tracking-[0.3em] text-body/80 uppercase">
                20. 2. 2027 &nbsp;·&nbsp; Plzeň
              </p>

              <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic max-w-sm leading-relaxed">
                „Večer oděný tajemstvím čeká na vyvolené.&quot;
              </p>

              <Countdown />

              <Divider wide />

              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center px-10 py-3 border border-gold/50 hover:border-gold transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold/5 group-hover:bg-gold/10 transition-colors duration-500" />
                <span className="relative font-[family-name:var(--font-display)] text-sm tracking-[0.3em] uppercase text-gold group-hover:text-gold-light transition-colors duration-500">
                  Vstupte
                </span>
              </Link>

              <Divider />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
