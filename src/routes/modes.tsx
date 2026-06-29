import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { GAME_MODES } from "@/lib/game-data";
import { PopButton } from "@/components/GameCard";
import { SiteNav } from "@/components/SiteNav";
import { useEffect } from "react";

export const Route = createFileRoute("/modes")({
  head: () => ({
    meta: [{ title: "اختر طريقة اللعب — شعبولي" }],
  }),
  component: ModesPage,
});

function ModesPage() {
  const nav = useNavigate();
  const { players, setMode, resetScores } = useGame();

  useEffect(() => {
    if (players.length < 2) nav({ to: "/start" });
  }, [players.length, nav]);

  return (
    <main className="min-h-dvh bg-cream pb-20">
      <SiteNav />
      <header className="hero-splash wave-bottom px-5 pb-16 pt-10 text-center">
        <h1 className="text-4xl font-black text-ink drop-shadow">اختاروا طريقة اللعب</h1>
        <p className="mt-2 font-bold text-ink/80">{players.length} لاعبين جاهزين</p>
      </header>

      <section className="mx-auto -mt-10 max-w-md space-y-4 px-5">
        {GAME_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              resetScores();
              setMode(m);
              nav({ to: "/play/$mode", params: { mode: m.id } });
            }}
            className="btn-pop btn-pop-active block w-full rounded-3xl bg-white p-4 text-right shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-cta text-3xl shadow">
                {m.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-nav">{m.name}</h3>
                <p className="text-sm font-bold text-primary">{m.subtitle}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-snug">{m.desc}</p>
              </div>
            </div>
          </button>
        ))}

        <Link to="/start" className="block pt-4 text-center text-muted-foreground underline">
          ← رجوع لتعديل اللاعبين
        </Link>
      </section>
    </main>
  );
}

// كومبوننت مساعد - مش مستخدم لكن عشان TS متذمرش
export const _PopButton = PopButton;

