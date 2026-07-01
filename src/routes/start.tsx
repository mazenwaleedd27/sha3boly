import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "@/lib/game-store";
import { PopButton } from "@/components/GameCard";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [{ title: "ابدأ اللعب — شعبولي" }],
  }),
  component: Start,
});

function Start() {
  const nav = useNavigate();
  const { players, setPlayers } = useGame();
  const [name, setName] = useState("");
  const [list, setList] = useState<string[]>(players.map((p) => p.name));

  function add() {
    const n = name.trim();
    if (!n || list.includes(n) || list.length >= 12) return;
    setList([...list, n]);
    setName("");
  }


  function start() {
    if (list.length < 2) return;
    setPlayers(list.map((n, i) => ({ id: `p${i}-${n}`, name: n, score: 0, cards: [] })));
    nav({ to: "/modes" });
  }

  return (
    <main className="min-h-dvh bg-cream">
      <SiteNav />
      <section className="hero-splash px-5 pb-20 pt-10 text-center">
        <h1 className="text-5xl font-black text-ink drop-shadow">مين هيلعب؟</h1>
        <p className="mt-2 text-lg font-bold text-ink/80">ضيف أسماء اللاعبين (من 2 لـ 12)</p>
      </section>

      <section className="mx-auto -mt-12 max-w-md px-5 pb-16">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="اسم اللاعب"
              className="flex-1 rounded-2xl border-2 border-input bg-muted px-4 py-3 text-lg font-bold text-ink outline-none focus:border-primary"
            />
            <PopButton onClick={add} variant="accent">＋</PopButton>
          </div>

          <ul className="mt-5 space-y-2">
            {list.map((n, i) => (
              <li key={n} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
                <span className="font-bold text-ink">
                  <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-nav text-sm text-white">
                    {i + 1}
                  </span>
                  {n}
                </span>
                <button
                  onClick={() => setList(list.filter((x) => x !== n))}
                  className="text-destructive font-black text-xl"
                  aria-label="حذف"
                >
                  ×
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="rounded-2xl bg-muted/60 py-6 text-center text-muted-foreground">
                ضيف اللاعبين عشان نبدأ
              </li>
            )}
          </ul>

          <div className="mt-6">
            <PopButton onClick={start} disabled={list.length < 2} className="w-full text-xl">
              يلا نبدأ ← {list.length >= 2 ? `(${list.length} لاعبين)` : "محتاج 2 على الأقل"}
            </PopButton>
          </div>
        </div>
      </section>
    </main>
  );
}
