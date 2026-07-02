import Link from "next/link";

interface NavCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
}

function NavCard({ href, icon, title, description }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group relative block p-8 border border-gold/30 hover:border-gold/60 transition-all duration-500"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.03] transition-colors duration-500" />

      {/* Corner diamonds */}
      <div className="absolute top-3 left-3 w-2 h-2 rotate-45 border-t border-l border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />
      <div className="absolute top-3 right-3 w-2 h-2 rotate-45 border-t border-r border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />
      <div className="absolute bottom-3 left-3 w-2 h-2 rotate-45 border-b border-l border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />
      <div className="absolute bottom-3 right-3 w-2 h-2 rotate-45 border-b border-r border-gold/40 group-hover:border-gold/70 transition-colors duration-500" />

      <div className="relative flex flex-col items-center text-center space-y-4">
        <span className="text-4xl">{icon}</span>
        <h2 className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-wider text-gold group-hover:text-gold-light transition-colors duration-500">
          {title}
        </h2>
        <p className="font-[family-name:var(--font-body)] text-base text-muted leading-relaxed">
          {description}
        </p>
        <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.3em] uppercase text-gold/50 group-hover:text-gold/70 transition-colors duration-500">
          Vstoupit &rarr;
        </span>
      </div>
    </Link>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 w-48">
      <div className="flex-1 h-px bg-gold/40" />
      <div className="w-2 h-2 rotate-45 border border-gold/60" />
      <div className="flex-1 h-px bg-gold/40" />
    </div>
  );
}

export default function NastenkaPage() {
  const cards: NavCardProps[] = [
    {
      href: "/profil",
      icon: "🎭",
      title: "Můj profil",
      description:
        "Spravujte své kontaktní údaje, adresu a telefonní číslo.",
    },
    {
      href: "/vstupenky",
      icon: "🎫",
      title: "Vstupenky",
      description:
        "Prohlédněte si nabídku vstupenek a zajistěte si místo na plese.",
    },
    {
      href: "/loterie",
      icon: "🎰",
      title: "Tombola",
      description:
        "Zakupte si losy do tombuly a vyhrajte jedinečné ceny.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <Divider />
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold tracking-wider text-gold-gradient leading-tight">
            Ve Žluté
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-muted italic">
            &bdquo;Každá maska skrývá pravdu, již světlo nesnese.&ldquo;
          </p>
          <Divider />
        </div>

        {/* Navigation cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <NavCard key={card.href} {...card} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Divider />
          <Link
            href="/"
            className="inline-block mt-6 font-[family-name:var(--font-display)] text-xs tracking-[0.3em] uppercase text-gold/50 hover:text-gold transition-colors duration-500"
          >
            &larr; Zpět na úvodní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}
