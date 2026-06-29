import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useGame, type Player } from "@/lib/game-store";
import { GAME_MODES, type TopicCard } from "@/lib/game-data";
import { pickLetter, pickTopic, pickTopics } from "@/lib/random";
import { PopButton } from "@/components/GameCard";
import { SiteNav } from "@/components/SiteNav";

import { TimerRing, useTimer } from "@/components/Timer";
import { GameIntro } from "@/components/GameIntro";

export const Route = createFileRoute("/play/$mode")({
  head: () => ({ meta: [{ title: "اللعب — شعبولي" }] }),
  component: PlayPage,
});

function PlayPage() {
  const { mode: modeId } = Route.useParams();
  const mode = GAME_MODES.find((m) => m.id === modeId);
  const { players } = useGame();
  const nav = useNavigate();
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!mode || players.length < 2) nav({ to: "/start" });
  }, [mode, players.length, nav]);

  useEffect(() => {
    setIntroDone(false);
  }, [modeId]);

  if (!mode || players.length < 2) return null;

  return (
    <main className="min-h-dvh bg-cream pb-28">
      <SiteNav />
      <PlayHero title={mode.name} subtitle={mode.subtitle} emoji={mode.emoji} />
      <div className="mx-auto -mt-10 max-w-md px-4">
        {!introDone ? (
          <GameIntro mode={mode} onDone={() => setIntroDone(true)} />
        ) : (
          <>
            {mode.id === "auction" && <AuctionMode />}
            {mode.id === "survival" && <SurvivalMode />}
            {mode.id === "pingpong" && <PingPongMode />}
            {mode.id === "hattrick" && <HatTrickMode />}
            {mode.id === "chain" && <ChainMode />}
          </>
        )}
      </div>
      <Scoreboard />
    </main>
  );
}

function PlayHero({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) {
  return (
    <header className="hero-splash wave-bottom px-5 pb-16 pt-8 text-center">
      <div className="mx-auto flex max-w-md items-center justify-center gap-3">
        <Link to="/modes" className="rounded-full bg-white/90 px-3 py-2 font-bold text-ink shadow">←</Link>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-cta text-3xl shadow">
          {emoji}
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-ink drop-shadow">{title}</div>
          <div className="text-sm font-bold text-ink/75">{subtitle}</div>
        </div>
      </div>
    </header>
  );
}


function Scoreboard() {
  const { players } = useGame();
  const sorted = [...players].sort((a, b) => b.score - a.score);
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-4 border-primary bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md gap-2 overflow-x-auto px-3 py-2">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${
              i === 0 ? "bg-accent text-accent-foreground" : "bg-muted text-ink"
            }`}
          >
            {i === 0 && "👑 "}
            {p.name}
            <span className="rounded-full bg-white/80 px-2">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Shared draw card ============ */
function DrawCard({
  topic,
  letter,
  badge,
}: {
  topic: TopicCard;
  letter: string | null;
  badge: string;
}) {
  return (
    <div className="space-y-4">
      <div className="mx-auto inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-black text-white shadow">
        {badge}
      </div>
      <div className="card-splash rounded-3xl p-3 shadow-xl">
        <div className="relative rounded-2xl bg-cream px-6 pb-6 pt-12 text-center">
          <div className="absolute -top-6 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-2xl shadow-lg">
            {letter ? "🔤" : "🎲"}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary/80">
            {topic.category}
          </p>
          <h2 className="mt-2 text-2xl font-black text-primary leading-tight">{topic.title}</h2>
          {letter && (
            <div className="mx-auto my-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-6xl font-black text-white shadow-xl">
              {letter}
            </div>
          )}
          <p className="mt-3 text-sm font-bold text-ink/80 leading-snug">
            {topic.hint}{letter ? ` يبدأ بحرف "${letter}"` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}


/* ============ MODE 1: AUCTION ============ */
function AuctionMode() {
  const { players, addScore } = useGame();
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"deal" | "draw" | "bid" | "answer" | "result">("deal");
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [winnerIdx, setWinnerIdx] = useState(0);
  const [bid, setBid] = useState(1);
  const [delivered, setDelivered] = useState(0);
  const timer = useTimer(30);

  function dealAndDraw() {
    const t = pickTopic();
    setTopic(t);
    setLetter(t.needsLetter ? pickLetter() : null);
    setPhase("bid");
    setBid(1);
    setWinnerIdx(0);
    setDelivered(0);
    timer.reset(30);
  }

  function scoreFor(n: number) {
    if (n <= 10) return 10;
    if (n <= 20) return 20;
    return 30;
  }

  function finish(success: boolean) {
    const pts = scoreFor(bid);
    addScore(players[winnerIdx].id, success ? pts : -pts);
    setPhase("result");
  }

  function nextRound() {
    if (round >= 5) return;
    setRound(round + 1);
    setPhase("deal");
  }

  if (phase === "deal") {
    return (
      <div className="space-y-4 text-center">
        <RoundBadge round={round} total={5} />
        <p className="rounded-2xl bg-card p-4 text-ink">
          جاهزين للجولة؟ هنسحب موضوع جديد وتبدأوا تزايدوا.
        </p>
        <PopButton onClick={dealAndDraw} className="w-full">اسحب الموضوع 🎴</PopButton>
      </div>
    );
  }


  if (phase === "bid" && topic) {
    return (
      <div className="space-y-5">
        <DrawCard topic={topic} letter={letter} badge={"المزاد · جولة " + round} />
        <div className="rounded-3xl bg-card p-5 text-center">
          <p className="font-bold text-ink">المزايد الفايز:</p>
          <div className="my-3 flex flex-wrap justify-center gap-2">
            {players.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setWinnerIdx(i)}
                className={`rounded-full px-4 py-2 font-bold ${i === winnerIdx ? "bg-primary text-primary-foreground" : "bg-muted text-ink"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="mt-3 font-bold text-ink">عدد الإجابات اللي وعد بيها:</p>
          <div className="my-3 flex items-center justify-center gap-3">
            <button onClick={() => setBid(Math.max(1, bid - 1))} className="h-12 w-12 rounded-full bg-secondary text-3xl font-black text-white">−</button>
            <div className="w-24 rounded-2xl bg-accent py-3 text-4xl font-black text-ink">{bid}</div>
            <button onClick={() => setBid(bid + 1)} className="h-12 w-12 rounded-full bg-secondary text-3xl font-black text-white">＋</button>
          </div>
          <p className="text-sm text-muted-foreground">على {scoreFor(bid)} نقطة (ربح أو خسارة)</p>
          <PopButton onClick={() => { setPhase("answer"); timer.reset(30); timer.start(); }} className="mt-4 w-full">ابدأ التايمر ⏱️</PopButton>
        </div>
      </div>
    );
  }

  if (phase === "answer" && topic) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-xl font-black text-ink">{players[winnerIdx].name} بيجاوب</p>
        <DrawCard topic={topic} letter={letter} badge={"جاوب! · " + bid} />
        <TimerRing time={timer.time} max={30} />
        <div className="rounded-2xl bg-card p-4">
          <p className="font-bold text-ink">عدد اللي قاله صح:</p>
          <div className="my-2 flex items-center justify-center gap-3">
            <button onClick={() => setDelivered(Math.max(0, delivered - 1))} className="h-10 w-10 rounded-full bg-secondary text-2xl text-white">−</button>
            <div className="w-20 rounded-2xl bg-muted py-2 text-3xl font-black">{delivered}</div>
            <button onClick={() => setDelivered(delivered + 1)} className="h-10 w-10 rounded-full bg-secondary text-2xl text-white">＋</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PopButton variant="secondary" onClick={() => finish(delivered >= bid)}>
            خلصت ⏹️
          </PopButton>
          <PopButton onClick={() => { timer.running ? timer.pause() : timer.start(); }} variant="accent">
            {timer.running ? "إيقاف" : "تشغيل"}
          </PopButton>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-3xl bg-card p-6">
          <h2 className="mb-2 text-3xl text-primary">انتهت الجولة!</h2>
          <p className="text-lg font-bold text-ink">{players[winnerIdx].name}</p>
          <p className="mt-1">قال {delivered} من {bid}</p>
        </div>
        {round < 5 ? (
          <PopButton onClick={nextRound} className="w-full">الجولة الجاية ←</PopButton>
        ) : (
          <FinishButtons />
        )}
      </div>
    );
  }
  return null;
}

/* ============ Shared elimination logic ============ */
function useElimination() {
  const { players, addScore } = useGame();
  const [alive, setAlive] = useState(players.map((p) => p.id));
  const [current, setCurrent] = useState(0);
  const remaining = alive.length;
  const currentPlayer = players.find((p) => p.id === alive[current % alive.length])!;

  function eliminate() {
    const newAlive = alive.filter((_, i) => i !== current % alive.length);
    setAlive(newAlive);
    if (newAlive.length === 0) setCurrent(0);
    else setCurrent(current % newAlive.length);
  }

  function next() {
    setCurrent((c) => (c + 1) % alive.length);
  }

  function awardWinner(pts: number) {
    if (alive.length === 1) addScore(alive[0], pts);
  }

  function reset() {
    setAlive(players.map((p) => p.id));
    setCurrent(0);
  }

  return { alive, currentPlayer, remaining, eliminate, next, awardWinner, reset, allPlayers: players };
}

/* ============ MODE 2: SURVIVAL ============ */
function SurvivalMode() {
  const elim = useElimination();
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const timer = useTimer(3);

  function start() {
    const t = pickTopic();
    setTopic(t);
    setLetter(t.needsLetter ? pickLetter() : null);
    elim.reset();
    timer.reset(3);
    timer.start();
  }

  useEffect(() => {
    if (timer.time === 0 && timer.running) {
      timer.pause();
    }
  }, [timer.time, timer.running, timer]);

  if (!topic) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">دور سريع — 3 ثواني للإجابة. اللي يكرر أو يتأخر يخرج.</p>
        <PopButton onClick={start} className="w-full">ابدأ الجولة 🎲</PopButton>
      </div>
    );
  }

  if (elim.remaining === 1) {
    const winner = elim.allPlayers.find((p) => p.id === elim.alive[0])!;
    return (
      <WinnerScreen
        name={winner.name}
        pts={10}
        onAward={() => elim.awardWinner(10)}
        onAgain={start}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DrawCard topic={topic} letter={letter} badge="بقاء · 3 ثواني" />
      <div className="rounded-3xl bg-card p-4 text-center">
        <p className="text-xl font-black text-primary">دور: {elim.currentPlayer.name}</p>
        <TimerRing time={timer.time} max={3} />
        <div className="grid grid-cols-2 gap-2">
          <PopButton
            variant="accent"
            onClick={() => { timer.reset(3); timer.start(); elim.next(); }}
          >
            جاوب ✓ التالي
          </PopButton>
          <PopButton
            variant="secondary"
            onClick={() => { elim.eliminate(); timer.reset(3); timer.start(); }}
          >
            خرج ✗
          </PopButton>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">باقي {elim.remaining} لاعبين</p>
      </div>
    </div>
  );
}

/* ============ MODE 3: PING PONG ============ */
function PingPongMode() {
  const { players, addScore } = useGame();
  const [pairs, setPairs] = useState<Array<[Player, Player]>>([]);
  const [pairIdx, setPairIdx] = useState(0);
  const [winners, setWinners] = useState<Player[]>([]);
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);
  const timer = useTimer(5);
  const [champion, setChampion] = useState<Player | null>(null);

  function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

  function buildPairs(roster: Player[]) {
    const s = shuffle(roster);
    const out: Array<[Player, Player]> = [];
    for (let i = 0; i + 1 < s.length; i += 2) out.push([s[i], s[i + 1]]);
    if (s.length % 2) out.push([s[s.length - 1], s[0]]); // bye → vs first
    return out;
  }

  function startTournament() {
    const p = buildPairs(players);
    setPairs(p);
    setPairIdx(0);
    setWinners([]);
    drawForPair();
  }

  function drawForPair() {
    const t = pickTopic();
    setTopic(t);
    setLetter(t.needsLetter ? pickLetter() : null);
    setTurn(0);
    timer.reset(5);
    timer.start();
  }

  function declareWinner(w: Player) {
    const newWinners = [...winners, w];
    if (pairIdx + 1 < pairs.length) {
      setWinners(newWinners);
      setPairIdx(pairIdx + 1);
      drawForPair();
    } else {
      // next round or champion
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
        addScore(newWinners[0].id, 10);
      } else {
        const p = buildPairs(newWinners);
        setPairs(p);
        setPairIdx(0);
        setWinners([]);
        drawForPair();
      }
    }
  }

  if (pairs.length === 0 && !champion) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">هنوزع اللاعبين على مواجهات ثنائية. الفائز يكمل لحد البطل النهائي.</p>
        <PopButton onClick={startTournament} className="w-full">ابدأ البطولة 🏆</PopButton>
      </div>
    );
  }

  if (champion) {
    return (
      <WinnerScreen
        name={champion.name}
        pts={10}
        onAward={() => {}}
        onAgain={() => { setChampion(null); setPairs([]); }}
      />
    );
  }

  const [a, b] = pairs[pairIdx];
  const active = turn % 2 === 0 ? a : b;
  const other = turn % 2 === 0 ? b : a;

  return (
    <div className="space-y-4">
      {topic && <DrawCard topic={topic} letter={letter} badge={`مواجهة ${pairIdx + 1}/${pairs.length}`} />}
      <div className="rounded-3xl bg-card p-4 text-center">
        <div className="flex items-center justify-around">
          <div className={`flex-1 rounded-2xl p-2 ${turn % 2 === 0 ? "bg-primary text-white" : "bg-muted"}`}>
            <div className="font-black">{a.name}</div>
          </div>
          <span className="px-2 text-2xl">🆚</span>
          <div className={`flex-1 rounded-2xl p-2 ${turn % 2 === 1 ? "bg-primary text-white" : "bg-muted"}`}>
            <div className="font-black">{b.name}</div>
          </div>
        </div>
        <p className="mt-3 text-lg font-bold text-ink">دور: {active.name}</p>
        <TimerRing time={timer.time} max={5} />
        <div className="grid grid-cols-2 gap-2">
          <PopButton variant="accent" onClick={() => { setTurn(turn + 1); timer.reset(5); timer.start(); }}>
            ✓ ردّ سليم
          </PopButton>
          <PopButton variant="secondary" onClick={() => declareWinner(other)}>
            خسر {active.name} ✗
          </PopButton>
        </div>
      </div>
    </div>
  );
}

/* ============ MODE 4: HAT-TRICK ============ */
function HatTrickMode() {
  const elim = useElimination();
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [letter, setLetter] = useState<string | null>(null);
  const timer = useTimer(10);

  const hasLetter = useMemo(() => topics.length > 0 && topics.every((t) => t.needsLetter), [topics]);
  const limit = hasLetter ? 10 : 5;

  function start() {
    const t = pickTopics(3);
    setTopics(t);
    const allLetter = t.every((x) => x.needsLetter);
    setLetter(allLetter ? pickLetter() : null);
    elim.reset();
    timer.reset(allLetter ? 10 : 5);
    timer.start();
  }

  if (topics.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">3 مواضيع + حرف واحد. اربطهم كلهم في الوقت!</p>
        <PopButton onClick={start} className="w-full">ابدأ الهاتريك 🎩</PopButton>
      </div>
    );
  }

  if (elim.remaining === 1) {
    const winner = elim.allPlayers.find((p) => p.id === elim.alive[0])!;
    return <WinnerScreen name={winner.name} pts={10} onAward={() => elim.awardWinner(10)} onAgain={start} />;
  }

  return (
    <div className="space-y-4">
      <div className="card-splash rounded-3xl p-3 shadow-xl">
        <div className="rounded-2xl bg-cream p-4">
          {letter && (
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-5xl font-black text-white shadow">
              {letter}
            </div>
          )}
          <div className="space-y-2">
            {topics.map((t, i) => (
              <div key={i} className="rounded-2xl bg-accent/60 px-4 py-3 text-center">
                <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">{i + 1}</span>
                <span className="font-display text-xl font-black text-ink">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl bg-card p-4 text-center">
        <p className="text-xl font-black text-primary">دور: {elim.currentPlayer.name}</p>
        <TimerRing time={timer.time} max={limit} />
        <div className="grid grid-cols-2 gap-2">
          <PopButton variant="accent" onClick={() => { timer.reset(limit); timer.start(); elim.next(); }}>
            قفل التلاتة ✓
          </PopButton>
          <PopButton variant="secondary" onClick={() => { elim.eliminate(); timer.reset(limit); timer.start(); }}>
            خرج ✗
          </PopButton>
        </div>
      </div>
    </div>
  );
}

/* ============ MODE 5: CHAIN ============ */
function ChainMode() {
  const elim = useElimination();
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [last, setLast] = useState<string>("");
  const timer = useTimer(3);

  function start() {
    setTopic(pickTopic());
    setLast("");
    elim.reset();
    timer.reset(3);
    timer.start();
  }

  if (!topic) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">كل لاعب يقول كلمة تبدأ بآخر حرف في الكلمة اللي قبله. (ة و ء تتجاهل)</p>
        <PopButton onClick={start} className="w-full">ابدأ السلسلة 🔗</PopButton>
      </div>
    );
  }

  if (elim.remaining === 1) {
    const winner = elim.allPlayers.find((p) => p.id === elim.alive[0])!;
    return <WinnerScreen name={winner.name} pts={10} onAward={() => elim.awardWinner(10)} onAgain={start} />;
  }

  function lastLetter(word: string) {
    let w = word.trim();
    while (w.length && ["ة", "و", "ء", "ى"].includes(w[w.length - 1])) w = w.slice(0, -1);
    return w[w.length - 1] || "";
  }

  return (
    <div className="space-y-4">
      <DrawCard topic={topic} letter={null} badge="السلسلة 🔗" />
      <div className="rounded-3xl bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">آخر كلمة:</p>
        <input
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="اكتب الكلمة"
          className="my-2 w-full rounded-2xl border-2 border-input bg-muted px-3 py-2 text-center text-2xl font-black text-ink outline-none"
        />
        {last && (
          <p className="text-lg font-bold text-primary">
            اللي بعده يبدأ بحرف:{" "}
            <span className="rounded-full bg-accent px-3 py-1 text-2xl text-ink">{lastLetter(last) || "؟"}</span>
          </p>
        )}
        <p className="mt-3 text-xl font-black text-ink">دور: {elim.currentPlayer.name}</p>
        <TimerRing time={timer.time} max={3} />
        <div className="grid grid-cols-2 gap-2">
          <PopButton variant="accent" onClick={() => { timer.reset(3); timer.start(); elim.next(); }}>
            جاوب ✓ التالي
          </PopButton>
          <PopButton variant="secondary" onClick={() => { elim.eliminate(); timer.reset(3); timer.start(); }}>
            خرج ✗
          </PopButton>
        </div>
      </div>
    </div>
  );
}

/* ============ Shared ============ */
function RoundBadge({ round, total }: { round: number; total: number }) {
  return (
    <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-black text-white">
      جولة {round} / {total}
    </div>
  );
}

function WinnerScreen({
  name,
  pts,
  onAward,
  onAgain,
}: {
  name: string;
  pts: number;
  onAward: () => void;
  onAgain: () => void;
}) {
  useEffect(() => {
    onAward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="space-y-4 text-center">
      <div className="card-splash rounded-3xl p-4 shadow-xl">
        <div className="rounded-2xl bg-cream py-8">
          <div className="text-7xl">👑</div>
          <h2 className="mt-3 text-3xl text-primary">{name}</h2>
          <p className="text-lg font-bold text-ink">كسب الجولة + {pts} نقطة</p>
        </div>
      </div>
      <PopButton onClick={onAgain} className="w-full">جولة جديدة 🎲</PopButton>
      <FinishButtons />
    </div>
  );
}

function FinishButtons() {
  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      <Link to="/modes" className="rounded-2xl bg-secondary px-4 py-3 text-center font-bold text-secondary-foreground btn-pop btn-pop-active">
        طريقة تانية
      </Link>
      <Link to="/" className="rounded-2xl bg-muted px-4 py-3 text-center font-bold text-ink btn-pop btn-pop-active">
        خلاص
      </Link>
    </div>
  );
}
