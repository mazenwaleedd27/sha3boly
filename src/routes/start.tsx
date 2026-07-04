import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useGame } from "@/lib/game-store";
import { SiteNav } from "@/components/SiteNav";
import boy from "@/assets/kid-boy.png";
import girl from "@/assets/kid-girl.png";
import backdrop from "@/assets/game-backdrop.jpg";

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
    <main className="min-h-dvh bg-nav">
      <SiteNav />

      <section
        className="relative min-h-[calc(100dvh-64px)] overflow-hidden"
        style={{
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* rays overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(0.85 0.2 60 / 0.9), transparent 70%)",
          }}
        />

        {/* characters */}
        <img
          src={boy}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-10 h-[45vh] w-auto max-h-[520px] drop-shadow-2xl md:h-[70vh]"
        />
        <img
          src={girl}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-[45vh] w-auto max-h-[520px] drop-shadow-2xl md:h-[70vh]"
        />

        <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-8">
          <h1 className="text-center">
            <span className="pop-title">مين هيلعب؟</span>
          </h1>
          <p className="mt-4 rounded-full bg-white/25 px-6 py-2 text-lg font-black text-white shadow backdrop-blur">
            ضيف أسماء اللاعبين (من 2 لـ 12)
          </p>

          {/* Card */}
          <div className="relative mt-8 w-full max-w-xl">
            <div className="rounded-[2.5rem] border-[6px] border-accent bg-white/95 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
              <div className="flex gap-3">
                <button
                  onClick={add}
                  aria-label="أضف لاعب"
                  className="btn-pop btn-pop-active flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-nav text-3xl font-black text-white"
                >
                  ＋
                </button>
                <div className="flex flex-1 items-center rounded-2xl border-2 border-input bg-muted px-4">
                  <span className="text-2xl">👤</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()}
                    placeholder="اسم اللاعب"
                    className="flex-1 bg-transparent px-3 py-3 text-lg font-bold text-ink outline-none"
                  />
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {list.map((n, i) => (
                  <li
                    key={n}
                    className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3"
                  >
                    <span className="flex items-center gap-2 font-bold text-ink">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nav text-sm text-white">
                        {i + 1}
                      </span>
                      {n}
                    </span>
                    <button
                      onClick={() => setList(list.filter((x) => x !== n))}
                      className="text-xl font-black text-destructive"
                      aria-label="حذف"
                    >
                      ×
                    </button>
                  </li>
                ))}
                {list.length === 0 && (
                  <li className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-5 text-center font-bold text-primary">
                    🎉 ضيف اللاعبين علشان نبدأ
                  </li>
                )}
              </ul>

              <button
                onClick={start}
                disabled={list.length < 2}
                className="btn-pop btn-pop-active mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-xl font-black text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-2xl">🚀</span>
                يلا نبدأ – {list.length >= 2 ? `(${list.length} لاعبين)` : "محتاج 2 على الأقل"}
              </button>
            </div>
          </div>

          {/* Stats footer */}
          <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: "👥", top: "من 2 إلى 12", bot: "لاعب", c: "bg-splash-teal" },
              { icon: "⚡", top: "سريع وسهل", bot: "ابدأ في ثواني", c: "bg-splash-pink" },
              { icon: "🏆", top: "متعة وحماس", bot: "أجواء تنافسية", c: "bg-primary" },
              { icon: "😀", top: "للكل", bot: "أصدقاء وعائلة", c: "bg-accent" },
            ].map((s) => (
              <div
                key={s.top}
                className="flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full text-xl text-white shadow ${s.c}`}>
                  {s.icon}
                </div>
                <div className="text-right leading-tight">
                  <div className="text-sm font-black text-primary">{s.top}</div>
                  <div className="text-xs font-bold text-ink/70">{s.bot}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
