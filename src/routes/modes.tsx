import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { GAME_MODES } from "@/lib/game-data";
import { PopButton } from "@/components/GameCard";
import { useEffect } from "react";

export const Route = createFileRoute("/modes")({
  head: () => ({
    meta: [{ title: "اختر طريقة اللعب — كلمة وحرف" }],
  }),
  component: ModesPage,
});

function ModesPage() {
  const nav = useNavigate();
  const { players, setMode, resetScores } = useGame();

  useEffect(() => {
    if (players.length < 2) nav({ to: "/" });
  }, [players.length, nav]);

  return (
    <main className="min-h-dvh bg-background pb-20">
      <header className="card-splash px-5 pt-8 pb-12 text-center">
        <h1 className="text-4xl font-black text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.3)]">
          اختاروا طريقة اللعب
        </h1>
        <p className="mt-2 text-white/95 font-bold">{players.length} لاعبين جاهزين</p>
      </header>

      <section className="mx-auto -mt-6 max-w-md space-y-4 px-5">
        {GAME_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              resetScores();
              setMode(m);
              nav({ to: "/play/$mode", params: { mode: m.id } });
            }}
            className="card-splash btn-pop btn-pop-active block w-full rounded-3xl p-3 text-right"
          >
            <div className="flex items-center gap-4 rounded-2xl bg-cream p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[4px] border-white bg-accent text-3xl shadow">
                {m.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-ink">{m.name}</h3>
                <p className="text-sm font-bold text-primary">{m.subtitle}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-snug">{m.desc}</p>
              </div>
            </div>
          </button>
        ))}

        <Link to="/" className="block pt-4 text-center text-muted-foreground underline">
          ← رجوع لتعديل اللاعبين
        </Link>
      </section>
    </main>
  );
}

// كومبوننت مساعد - مش مستخدم لكن عشان TS متذمرش
export const _PopButton = PopButton;
