import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "@/lib/game-store";
import { PopButton } from "@/components/GameCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كلمة وحرف — لعبة الجماعة" },
      { name: "description", content: "العب لعبة كلمة وحرف من موبايل واحد مع أصحابك. مزاد، بقاء للأسرع، بينج بونج، هاتريك، وسلسلة." },
      { property: "og:title", content: "كلمة وحرف — لعبة الجماعة" },
      { property: "og:description", content: "موبايل واحد، تحديات سريعة، كروت قوة وتلبيس، وضحك مالوش آخر." },
    ],
  }),
  component: Home,
});

function Home() {
  const nav = useNavigate();
  const { players, setPlayers } = useGame();
  const [name, setName] = useState("");
  const [list, setList] = useState<string[]>(players.map((p) => p.name));

  function add() {
    const n = name.trim();
    if (!n || list.includes(n)) return;
    setList([...list, n]);
    setName("");
  }

  function start() {
    if (list.length < 2) return;
    setPlayers(
      list.map((n, i) => ({ id: `p${i}-${n}`, name: n, score: 0, cards: [] })),
    );
    nav({ to: "/modes" });
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="card-splash absolute inset-x-0 top-0 -z-0 h-72 opacity-90" />
      <div className="relative mx-auto max-w-md px-5 pt-10 pb-20">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-3 inline-flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-accent shadow-xl">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-5xl font-black text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.3)]">
            كلمة وحرف
          </h1>
          <p className="mt-2 text-white/95 font-bold text-lg drop-shadow">
            موبايل واحد · كذا لاعب · ضحك ومنافسة
          </p>
        </header>

        <section className="rounded-3xl bg-card p-6 shadow-xl">
          <h2 className="mb-4 text-2xl text-ink">مين هيلعب؟</h2>
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
              <li
                key={n}
                className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3"
              >
                <span className="font-bold text-ink">
                  <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-white">
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
            <PopButton
              onClick={start}
              disabled={list.length < 2}
              className="w-full text-xl"
            >
              يلا نبدأ ← {list.length >= 2 ? `(${list.length} لاعبين)` : "محتاج 2 على الأقل"}
            </PopButton>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          مرّروا الموبايل بين اللاعبين بعد كل دور
        </p>
      </div>
    </main>
  );
}
