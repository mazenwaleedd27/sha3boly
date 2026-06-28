import { useState, useEffect, useRef } from "react";
import { useGame } from "@/lib/game-store";
import type { GameMode } from "@/lib/game-data";
import { PopButton } from "@/components/GameCard";
import { FrameCard } from "@/components/FrameCard";

/**
 * فلو "ادي الموبايل للاعب" قبل بداية كل لعبة:
 * 1) شاشة شرح اللعبة.
 * 2) لكل لاعب: شاشة "ادي الموبايل لـ X" → "تم" → بيشوف كروته → "ادي الموبايل لـ Y".
 * 3) آخر لاعب يدوس "ابدأ اللعب" فبيستدعي onDone().
 */
export function GameIntro({ mode, onDone }: { mode: GameMode; onDone: () => void }) {
  const { players, giveRandomCard, clearAllCards } = useGame();
  const [stage, setStage] = useState<"explain" | "pass" | "reveal">("explain");
  const [idx, setIdx] = useState(0);
  const initialized = useRef(false);

  const current = players[idx];
  const isLast = idx >= players.length - 1;

  function startDealing() {
    if (!initialized.current) {
      clearAllCards();
      initialized.current = true;
    }
    setIdx(0);
    setStage("pass");
  }

  function reveal() {
    // وزّع كارتين للاعب الحالي
    giveRandomCard(current.id);
    giveRandomCard(current.id);
    setStage("reveal");
  }

  function nextPlayer() {
    if (isLast) {
      onDone();
      return;
    }
    setIdx(idx + 1);
    setStage("pass");
  }

  if (stage === "explain") {
    return (
      <div className="space-y-5">
        <div className="card-splash rounded-3xl p-3 shadow-xl">
          <div className="rounded-2xl bg-cream p-5 text-center">
            <div className="text-5xl">{mode.emoji}</div>
            <h2 className="mt-2 text-3xl text-primary">{mode.name}</h2>
            <p className="font-bold text-ink/80">{mode.subtitle}</p>
            <p className="mt-3 text-ink">{mode.desc}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-lg">
          <h3 className="mb-3 text-xl text-primary">📜 طريقة اللعب</h3>
          <ol className="space-y-2 text-right">
            {mode.rules.map((r, i) => (
              <li key={i} className="flex gap-2 rounded-2xl bg-muted px-3 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                  {i + 1}
                </span>
                <span className="font-bold text-ink leading-snug">{r}</span>
              </li>
            ))}
          </ol>
        </div>

        <PopButton onClick={startDealing} className="w-full text-xl">
          فهمنا، وزّع الكروت 🎴
        </PopButton>
      </div>
    );
  }

  if (stage === "pass") {
    return (
      <div className="space-y-5 text-center">
        <div className="rounded-3xl bg-card p-6 shadow-xl">
          <p className="text-lg font-bold text-muted-foreground">📱 مرّروا الموبايل</p>
          <p className="mt-3 text-2xl font-black text-ink">ادي الموبايل لـ</p>
          <div className="my-4 inline-block rounded-3xl bg-gradient-to-br from-primary to-secondary px-8 py-4 text-4xl font-black text-white shadow-lg">
            {current.name}
          </div>
          <p className="text-sm text-muted-foreground">عشان يشوف كروته بسرية</p>
        </div>
        <PopButton onClick={reveal} className="w-full text-xl" variant="accent">
          أنا {current.name} — تم ✓
        </PopButton>
        <p className="text-xs text-muted-foreground">لاعب {idx + 1} من {players.length}</p>
      </div>
    );
  }

  // reveal
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-card p-4 text-center shadow">
        <p className="text-sm text-muted-foreground">كروت</p>
        <p className="text-2xl font-black text-primary">{current.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">احفظهم في دماغك ومتقولش لحد!</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {current.cards.map((c, i) => (
          <FrameCard
            key={i}
            badge={<span className="text-2xl">{c.emoji}</span>}
          >
            <div
              className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${
                c.kind === "power" ? "bg-secondary text-white" : "bg-destructive text-white"
              }`}
            >
              {c.kind === "power" ? "قوة" : "تلبيس"}
            </div>
            <h3 className="text-base leading-tight text-ink">{c.name}</h3>
            <p className="text-[11px] leading-snug text-ink/80">{c.desc}</p>
          </FrameCard>
        ))}
      </div>

      <PopButton onClick={nextPlayer} className="w-full text-lg" variant="secondary">
        {isLast ? "خفيت كروتي · ابدأ اللعب 🚀" : `خفيت · ادي الموبايل لـ ${players[idx + 1].name} ←`}
      </PopButton>
    </div>
  );
}

/** هوك صغير: لو true يبقي عرضنا الـIntro؛ يتحول false بعد ما يدوس "ابدأ اللعب" */
export function useIntro() {
  const [shown, setShown] = useState(true);
  useEffect(() => () => setShown(true), []);
  return { shown, done: () => setShown(false), reset: () => setShown(true) };
}
