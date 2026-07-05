import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { GAME_MODES } from "@/lib/game-data";
import { SiteNav } from "@/components/SiteNav";
import { useEffect } from "react";
import boy from "@/assets/kid-boy.png";
import girl from "@/assets/kid-girl.png";


export const Route = createFileRoute("/modes")({
  head: () => ({
    meta: [{ title: "اختر طريقة اللعب — شعبولي" }],
  }),
  component: ModesPage,
});

const MODE_STYLES: Record<
  string,
  { bg: string; ring: string; title: string; icon: string; emoji: string }
> = {
  auction: {
    bg: "bg-pink-50",
    ring: "ring-pink-300",
    title: "text-pink-600",
    icon: "bg-gradient-to-br from-pink-500 to-rose-600",
    emoji: "🎯",
  },
  survival: {
    bg: "bg-sky-50",
    ring: "ring-sky-300",
    title: "text-sky-700",
    icon: "bg-gradient-to-br from-sky-400 to-blue-600",
    emoji: "⚡",
  },
  pingpong: {
    bg: "bg-green-50",
    ring: "ring-green-300",
    title: "text-green-700",
    icon: "bg-gradient-to-br from-green-400 to-emerald-600",
    emoji: "🏓",
  },
  hattrick: {
    bg: "bg-orange-50",
    ring: "ring-orange-300",
    title: "text-orange-600",
    icon: "bg-gradient-to-br from-amber-400 to-orange-600",
    emoji: "🎩",
  },
  chain: {
    bg: "bg-purple-50",
    ring: "ring-purple-300",
    title: "text-purple-700",
    icon: "bg-gradient-to-br from-purple-500 to-violet-700",
    emoji: "🔗",
  },
};

function ModesPage() {
  const nav = useNavigate();
  const { players, setMode, resetScores } = useGame();

  useEffect(() => {
    if (players.length < 2) nav({ to: "/start" });
  }, [players.length, nav]);

  return (
    <main className="min-h-dvh bg-[#FFB800]">
      <SiteNav />

      <section
        className="relative min-h-[calc(100dvh-64px)] overflow-hidden"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 30%, oklch(0.85 0.2 60 / 0.95), transparent 70%)",
          }}
        />

        <img
          src={boy}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-10 hidden h-[60vh] w-auto max-h-[560px] drop-shadow-2xl md:block"
        />
        <img
          src={girl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 z-10 hidden h-[60vh] w-auto max-h-[560px] drop-shadow-2xl md:block"
        />

        <div className="relative z-20 mx-auto max-w-3xl px-4 pb-16 pt-8">
          <div className="text-center">
            <h1>
              <span className="pop-title">اختاروا طريقة اللعب</span>
            </h1>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/25 px-5 py-2 text-base font-black text-white shadow backdrop-blur">
              👥 {players.length} لاعبين جاهزين
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {GAME_MODES.map((m) => {
              const s = MODE_STYLES[m.id] ?? MODE_STYLES.auction;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => {
                      resetScores();
                      setMode(m);
                      nav({ to: "/play/$mode", params: { mode: m.id } });
                    }}
                    className={`btn-pop btn-pop-active group flex w-full items-center gap-4 rounded-3xl border-4 border-white ${s.bg} p-4 text-right shadow-xl ring-2 ${s.ring}`}
                  >
                    {/* icon on right (RTL first) */}
                    <div
                      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white text-4xl text-white shadow-lg ${s.icon}`}
                    >
                      {s.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-black ${s.title}`}>{m.name}</h3>
                      <p className={`text-sm font-black ${s.title} opacity-80`}>{m.subtitle}</p>
                      <p className="mt-1 text-sm font-bold leading-snug text-ink/70">{m.desc}</p>
                    </div>
                    <span className="hidden self-center text-3xl font-black text-ink/40 group-hover:text-ink md:block">
                      ‹‹
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 text-center">
            <Link
              to="/start"
              className="inline-block rounded-full bg-white/90 px-6 py-2 font-black text-nav shadow"
            >
              ← رجوع لتعديل اللاعبين
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
