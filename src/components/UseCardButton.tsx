import { useState } from "react";
import { useGame, type Player } from "@/lib/game-store";
import { type PowerCard } from "@/lib/game-data";
import { PopButton } from "@/components/GameCard";

/* الكروت اللي ليها تأثير تلقائي على النقط أو الكروت */
function needsTarget(card: PowerCard) {
  return ["سرقة 5 نقاط", "سرقة كارت", "قنبلة!"].includes(card.name);
}

function autoEffectText(card: PowerCard) {
  switch (card.name) {
    case "+10 نقاط":
      return "هيتزود ليك 10 نقط على طول";
    case "سرقة 5 نقاط":
      return "اختار لاعب هتسرق منه 5 نقط";
    case "قنبلة!":
      return "اختار اللاعب اللي هيخسر 5 نقط";
    case "سرقة كارت":
      return "اختار لاعب هتاخد كارته";
    default:
      return null;
  }
}

export function UseCardButton() {
  const { players, addScore, removeCard, setPlayers } = useGame();
  const [open, setOpen] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string>("");
  const [done, setDone] = useState<string | null>(null);

  const player = players.find((p) => p.id === playerId) ?? null;
  const card = player?.cards[0] ?? null;

  function reset() {
    setOpen(false);
    setPlayerId(null);
    setTargetId("");
    setDone(null);
  }

  function backToList() {
    setPlayerId(null);
    setTargetId("");
    setDone(null);
  }

  function applyCard(owner: Player, c: PowerCard, target: Player | null) {
    switch (c.name) {
      case "+10 نقاط":
        addScore(owner.id, 10);
        setDone(`${owner.name} خد 10 نقط ➕`);
        break;
      case "سرقة 5 نقاط":
        if (!target) return;
        addScore(target.id, -5);
        addScore(owner.id, 5);
        setDone(`${owner.name} سرق 5 نقط من ${target.name} 🦹`);
        break;
      case "قنبلة!":
        if (!target) return;
        addScore(target.id, -5);
        setDone(`${target.name} خسر 5 نقط 💥`);
        break;
      case "سرقة كارت": {
        if (!target) return;
        const stolen = target.cards[0];
        setPlayers(
          players.map((p) => {
            if (p.id === target.id) return { ...p, cards: p.cards.slice(1) };
            if (p.id === owner.id)
              return { ...p, cards: stolen ? [...p.cards.slice(1), stolen] : p.cards.slice(1) };
            return p;
          }),
        );
        setDone(
          stolen
            ? `${owner.name} خد كارت ${target.name} 🦝`
            : `${target.name} مش معاه كارت 🤷`,
        );
        return;
      }
      default:
        setDone(`نفّذوا الكارت: ${c.desc}`);
    }
    // شيل الكارت من إيد اللاعب
    const idx = owner.cards.indexOf(c);
    removeCard(owner.id, idx === -1 ? 0 : idx);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-16 left-3 z-30 rounded-full bg-primary px-6 py-4 text-lg font-black text-primary-foreground shadow-lg"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        🃏 الكروت
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3">
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-5 space-y-4">
        {done ? (
          <>
            <h3 className="text-center text-2xl font-black text-primary">تم ✅</h3>
            <p className="text-center text-lg font-bold text-ink leading-relaxed">{done}</p>
            <PopButton className="w-full" onClick={backToList}>تمام</PopButton>
          </>
        ) : !player ? (
          <>
            <h3 className="text-center text-2xl font-black text-primary">🃏 كروت اللاعبين</h3>
            <p className="text-center text-sm font-bold text-ink/70">
              كل لاعب ياخد الموبايل ويدوس على الكارت بتاعه
            </p>
            <div className="space-y-3">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-muted p-3"
                >
                  <span className="min-w-0 flex-1 truncate text-lg font-black text-ink">
                    {p.name}
                  </span>
                  {p.cards.length > 0 ? (
                    <button
                      onClick={() => setPlayerId(p.id)}
                      className="shrink-0 rounded-full bg-primary px-5 py-3 text-base font-black text-primary-foreground shadow"
                    >
                      🃏 الكارت بتاعك
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-full bg-ink/10 px-4 py-2 text-sm font-bold text-ink/50">
                      مفيش كارت
                    </span>
                  )}
                </div>
              ))}
            </div>
            <PopButton variant="ghost" className="w-full" onClick={reset}>إغلاق</PopButton>
          </>
        ) : !card ? (
          <>
            <p className="text-center text-lg font-bold text-ink">{player.name} مش معاه كارت</p>
            <PopButton className="w-full" onClick={backToList}>رجوع</PopButton>
          </>
        ) : (
          <>
            <h3 className="text-center text-2xl font-black text-primary">{player.name}</h3>
            <div className="card-splash rounded-3xl p-3">
              <div className="relative rounded-2xl bg-cream px-5 pb-6 pt-14 text-center">
                <div className="absolute -top-7 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-3xl shadow-lg">
                  {card.emoji}
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-primary/80">
                  {card.kind === "power" ? "كارت قوة" : "كارت تلبيس"}
                </p>
                <h3 className="mt-2 text-2xl font-black text-primary leading-tight">{card.name}</h3>
                <p className="mt-3 text-base font-bold text-ink/80 leading-relaxed">{card.desc}</p>
                {autoEffectText(card) && (
                  <p className="mt-3 text-sm font-bold text-secondary">{autoEffectText(card)}</p>
                )}
              </div>
            </div>

            {needsTarget(card) && (
              <div className="flex flex-wrap justify-center gap-2">
                {players
                  .filter((p) => p.id !== player.id)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setTargetId(p.id)}
                      className={`rounded-full px-5 py-3 text-base font-bold ${
                        p.id === targetId ? "bg-primary text-primary-foreground" : "bg-muted text-ink"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
              </div>
            )}

            <PopButton
              className="w-full"
              disabled={needsTarget(card) && !targetId}
              onClick={() =>
                applyCard(player, card, players.find((p) => p.id === targetId) ?? null)
              }
            >
              استخدم الكارت 🔥
            </PopButton>
            <PopButton variant="ghost" className="w-full" onClick={backToList}>رجوع</PopButton>
          </>
        )}
      </div>
    </div>
  );
}
