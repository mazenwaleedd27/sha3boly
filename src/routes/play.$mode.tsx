import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useGame, type Player } from "@/lib/game-store";
import { type TopicCard } from "@/lib/game-data";
import { useModes } from "@/lib/use-content";
import { pickLetter, pickTopic, pickTopics } from "@/lib/random";
import { PopButton } from "@/components/GameCard";
import { SiteNav } from "@/components/SiteNav";
import { GameIntro } from "@/components/GameIntro";

export const Route = createFileRoute("/play/$mode")({
  head: () => ({ meta: [{ title: "اللعب — شعبولي" }] }),
  component: PlayPage,
});

/* هل اللعب بحرف ولا من غير حرف */
const LetterModeContext = createContext<boolean>(true);
const useLetterMode = () => useContext(LetterModeContext);

function LetterChoice({ onPick }: { onPick: (withLetter: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="card-splash rounded-3xl p-3 shadow-xl">
        <div className="relative rounded-2xl bg-cream px-6 pb-6 pt-14 text-center">
          <div className="absolute -top-7 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-3xl shadow-lg">
            🔤
          </div>
          <h2 className="text-2xl font-black text-primary">هتلعبوا إزاي؟</h2>
          <p className="mt-2 text-sm font-bold text-ink/80">
            اختاروا: اللعب بحرف معين ولا من غير حرف خالص
          </p>
        </div>
      </div>
      <div className="grid gap-3">
        <PopButton onClick={() => onPick(true)} className="w-full">بحرف 🔤</PopButton>
        <PopButton variant="secondary" onClick={() => onPick(false)} className="w-full">
          من غير حرف 🚫
        </PopButton>
      </div>
    </div>
  );
}

/* كارت الحرف اللي بيتعرض قبل الموضوع */
function LetterCard({ letter, onDone }: { letter: string; onDone: () => void }) {
  return (
    <div className="space-y-4">
      <div className="mx-auto inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-black text-white shadow">
        كارت الحرف
      </div>
      <div className="card-splash rounded-3xl p-3 shadow-xl">
        <div className="relative rounded-2xl bg-cream px-6 pb-8 pt-14 text-center">
          <div className="absolute -top-7 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-accent text-3xl shadow-lg">
            🔤
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary/80">الحرف</p>
          <div className="mx-auto my-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-7xl font-black text-white shadow-xl">
            {letter}
          </div>
          <p className="text-sm font-bold text-ink/80">كل الإجابات لازم تبدأ بالحرف ده</p>
        </div>
      </div>
      <PopButton onClick={onDone} className="w-full">شوف الموضوع 🎴</PopButton>
    </div>
  );
}

function PlayPage() {
  const { mode: modeId } = Route.useParams();
  const modes = useModes();
  const mode = modes.find((m) => m.id === modeId);
  const { players } = useGame();
  const nav = useNavigate();
  const [introDone, setIntroDone] = useState(false);
  const [withLetter, setWithLetter] = useState<boolean | null>(null);

  useEffect(() => {
    if (!mode || players.length < 2) nav({ to: "/start" });
  }, [mode, players.length, nav]);

  useEffect(() => {
    setIntroDone(false);
    setWithLetter(null);
  }, [modeId]);

  if (!mode || players.length < 2) return null;

  return (
    <main className="min-h-dvh bg-[#FFB800] pb-28">
      <SiteNav />
      <PlayHero title={mode.name} subtitle={mode.subtitle} emoji={mode.emoji} />
      <div className="mx-auto -mt-10 max-w-md px-4">
        {!introDone ? (
          <GameIntro mode={mode} onDone={() => setIntroDone(true)} />
        ) : withLetter === null ? (
          <LetterChoice onPick={setWithLetter} />
        ) : (
          <LetterModeContext.Provider value={withLetter}>
            {mode.id === "auction" && <AuctionMode />}
            {mode.id === "survival" && <SurvivalMode />}
            {mode.id === "pingpong" && <PingPongMode />}
            {mode.id === "hattrick" && <HatTrickMode />}
            {mode.id === "chain" && <ChainMode />}
          </LetterModeContext.Provider>
        )}
      </div>
      <Scoreboard />
    </main>
  );
}


function PlayHero({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) {
  return (
    <header className="hero-splash px-5 pb-16 pt-8 text-center">
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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-4 border-primary bg-card/95 backdrop-blur" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
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

/* ============ Reusable win/lose picker ============ */
function WinLosePicker({
  onWin,
  onLose,
  winLabel = "كسب ✓",
  loseLabel = "خسر ✗",
}: {
  onWin: (player: Player) => void;
  onLose: (player: Player) => void;
  winLabel?: string;
  loseLabel?: string;
}) {
  const { players } = useGame();
  const [selectedId, setSelectedId] = useState<string>(players[0]?.id ?? "");
  const selected = players.find((p) => p.id === selectedId) ?? players[0];

  return (
    <div className="rounded-3xl bg-card p-4 space-y-3">
      <p className="text-center font-bold text-ink">اختر اللاعب:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {players.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`rounded-full px-4 py-2 font-bold text-sm ${
              p.id === selectedId ? "bg-primary text-primary-foreground" : "bg-muted text-ink"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <PopButton variant="accent" onClick={() => selected && onWin(selected)}>
          {winLabel}
        </PopButton>
        <PopButton variant="secondary" onClick={() => selected && onLose(selected)}>
          {loseLabel}
        </PopButton>
      </div>
    </div>
  );
}

/* ============ MODE 1: AUCTION ============ */
function AuctionMode() {
  const { players, addScore } = useGame();
  const withLetter = useLetterMode();
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"topic" | "bid" | "play" | "result">("topic");
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterSeen, setLetterSeen] = useState(false);
  const [lastName, setLastName] = useState<string>("");
  const [lastPts, setLastPts] = useState<number>(0);
  const [bidAmount, setBidAmount] = useState<number>(5);
  const [bidderId, setBidderId] = useState<string>("");
  const [drawn, setDrawn] = useState(false);

  function drawTopic() {
    const t = pickTopic(withLetter ? true : undefined);
    setTopic(t);
    setLetter(withLetter ? pickLetter() : null);
    setLetterSeen(!withLetter);
    setDrawn(true);
  }

  function goToBid() {
    setBidderId(players[0]?.id ?? "");
    setBidAmount(5);
    setPhase("bid");
  }

  function confirmBid() {
    if (!bidderId) return;
    setPhase("play");
  }


  function winPoints(bid: number) {
    if (bid >= 30) return 30;
    if (bid >= 21 && bid <= 29) return 20;
    return 10;
  }

  function handleWin(p: Player) {
    const pts = winPoints(bidAmount);
    addScore(p.id, pts);
    setLastName(p.name);
    setLastPts(pts);
    setPhase("result");
  }

  function handleLose(p: Player) {
    addScore(p.id, -10);
    setLastName(p.name);
    setLastPts(-10);
    setPhase("result");
  }

  function nextRound() {
    if (round >= 5) return;
    setRound(round + 1);
    setDrawn(false);
    setTopic(null);
    setLetterSeen(false);
    setPhase("topic");
  }

  if (phase === "topic") {
    if (!drawn || !topic) {
      return (
        <div className="space-y-4">
          <RoundBadge round={round} total={5} />
          <PopButton onClick={drawTopic} className="w-full">
            {withLetter ? "اسحب الحرف والموضوع 🎴" : "اسحب الموضوع 🎴"}
          </PopButton>
        </div>
      );
    }
    if (withLetter && !letterSeen && letter) {
      return <LetterCard letter={letter} onDone={() => setLetterSeen(true)} />;
    }
    return (
      <div className="space-y-4">
        <DrawCard topic={topic} letter={letter} badge={"الموضوع · جولة " + round} />
        <PopButton onClick={goToBid} className="w-full">
          ابدأ المزاد 🔨
        </PopButton>
      </div>
    );
  }




  if (phase === "bid") {
    return (
      <div className="space-y-4">
        <RoundBadge round={round} total={5} />
        <div className="rounded-3xl bg-card p-4 space-y-4 text-center">
          <h2 className="text-2xl text-primary">المزاد 🔨</h2>
          <div>
            <p className="mb-2 font-bold text-ink">العدد اللي اتقال:</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setBidAmount(Math.max(1, bidAmount - 1))}
                className="h-12 w-12 rounded-full bg-muted text-2xl font-black text-ink"
              >−</button>
              <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-primary text-4xl font-black text-white shadow">
                {bidAmount}
              </div>
              <button
                onClick={() => setBidAmount(bidAmount + 1)}
                className="h-12 w-12 rounded-full bg-muted text-2xl font-black text-ink"
              >+</button>
            </div>
          </div>
          <div>
            <p className="mb-2 font-bold text-ink">مين اللي قال {bidAmount}؟</p>
            <div className="flex flex-wrap justify-center gap-2">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setBidderId(p.id)}
                  className={`rounded-full px-4 py-2 font-bold text-sm ${
                    p.id === bidderId ? "bg-primary text-primary-foreground" : "bg-muted text-ink"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <PopButton onClick={confirmBid} disabled={!bidderId} className="w-full">
          يلا نبدأ اللعبة 🎴
        </PopButton>
      </div>
    );
  }

  if (phase === "play" && topic) {
    const bidder = players.find((p) => p.id === bidderId);
    return (
      <div className="space-y-5">
        {bidder && (
          <div className="rounded-2xl bg-accent/60 p-3 text-center font-bold text-ink">
            {bidder.name} قال {bidAmount} — يلا نشوف!
          </div>
        )}
        <DrawCard topic={topic} letter={letter} badge={"المزاد · جولة " + round} />
        <WinLosePicker onWin={handleWin} onLose={handleLose} winLabel={`كسب +${winPoints(bidAmount)}`} loseLabel="خسر −10" />
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-3xl bg-card p-6">
          <h2 className="mb-2 text-3xl text-primary">انتهت الجولة!</h2>
          <p className="text-lg font-bold text-ink">{lastName}</p>
          <p className="mt-1 font-bold">{lastPts >= 0 ? `+${lastPts}` : lastPts} نقطة</p>
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


/* ============ MODE 2: SURVIVAL ============ */
function SurvivalMode() {
  const { players, addScore } = useGame();
  const withLetter = useLetterMode();
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterSeen, setLetterSeen] = useState(false);
  const [alive, setAlive] = useState<string[]>(players.map((p) => p.id));

  function start() {
    const t = pickTopic(withLetter ? true : undefined);
    setTopic(t);
    setLetter(withLetter ? pickLetter() : null);
    setLetterSeen(!withLetter);
    setAlive(players.map((p) => p.id));
  }

  const aliveList = players.filter((p) => alive.includes(p.id));

  if (!topic) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">دوّروا سريع — اللي يكرر أو يعجز يخرج. آخر واحد صامد يكسب.</p>
        <PopButton onClick={start} className="w-full">ابدأ الجولة 🎲</PopButton>
      </div>
    );
  }

  if (withLetter && !letterSeen && letter) {
    return <LetterCard letter={letter} onDone={() => setLetterSeen(true)} />;
  }

  if (aliveList.length === 1) {
    return (
      <WinnerScreen
        name={aliveList[0].name}
        pts={10}
        onAward={() => addScore(aliveList[0].id, 10)}
        onAgain={start}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DrawCard topic={topic} letter={letter} badge="بقاء" />
      <div className="rounded-3xl bg-card p-4 space-y-3">
        <p className="text-center font-bold text-ink">اللاعبين الصامدين ({aliveList.length}) — اختر اللي خرج:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {aliveList.map((p) => (
            <button
              key={p.id}
              onClick={() => setAlive(alive.filter((id) => id !== p.id))}
              className="rounded-full bg-destructive/10 px-4 py-2 font-bold text-sm text-ink border-2 border-destructive/40 hover:bg-destructive hover:text-white"
            >
              {p.name} خرج ✗
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ MODE 3: PING PONG ============ */
function PingPongMode() {
  const { players, addScore } = useGame();
  const withLetter = useLetterMode();
  const [pairs, setPairs] = useState<Array<[Player, Player]>>([]);
  const [pairIdx, setPairIdx] = useState(0);
  const [winners, setWinners] = useState<Player[]>([]);
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterSeen, setLetterSeen] = useState(false);
  const [champion, setChampion] = useState<Player | null>(null);

  function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

  function buildPairs(roster: Player[]) {
    const s = shuffle(roster);
    const out: Array<[Player, Player]> = [];
    for (let i = 0; i + 1 < s.length; i += 2) out.push([s[i], s[i + 1]]);
    if (s.length % 2) out.push([s[s.length - 1], s[0]]);
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
    const t = pickTopic(withLetter ? true : undefined);
    setTopic(t);
    setLetter(withLetter ? pickLetter() : null);
    setLetterSeen(!withLetter);
  }

  function declareWinner(w: Player) {
    const newWinners = [...winners, w];
    if (pairIdx + 1 < pairs.length) {
      setWinners(newWinners);
      setPairIdx(pairIdx + 1);
      drawForPair();
    } else {
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

  if (withLetter && !letterSeen && letter) {
    return <LetterCard letter={letter} onDone={() => setLetterSeen(true)} />;
  }

  const [a, b] = pairs[pairIdx];

  return (
    <div className="space-y-4">
      {topic && <DrawCard topic={topic} letter={letter} badge={`مواجهة ${pairIdx + 1}/${pairs.length}`} />}
      <div className="rounded-3xl bg-card p-4 text-center space-y-3">
        <div className="flex items-center justify-around">
          <div className="flex-1 rounded-2xl p-2 bg-muted"><div className="font-black">{a.name}</div></div>
          <span className="px-2 text-2xl">🆚</span>
          <div className="flex-1 rounded-2xl p-2 bg-muted"><div className="font-black">{b.name}</div></div>
        </div>
        <p className="font-bold text-ink">مين كسب المواجهة؟</p>
        <div className="grid grid-cols-2 gap-2">
          <PopButton variant="accent" onClick={() => declareWinner(a)}>{a.name} كسب ✓</PopButton>
          <PopButton variant="accent" onClick={() => declareWinner(b)}>{b.name} كسب ✓</PopButton>
        </div>
      </div>
    </div>
  );
}

/* ============ MODE 4: HAT-TRICK ============ */
function HatTrickMode() {
  const { players, addScore } = useGame();
  const withLetter = useLetterMode();
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterSeen, setLetterSeen] = useState(false);
  const [alive, setAlive] = useState<string[]>(players.map((p) => p.id));

  const hasLetter = useMemo(() => topics.length > 0 && withLetter, [topics, withLetter]);

  function start() {
    const t = pickTopics(3, withLetter ? true : undefined);
    setTopics(t);
    setLetter(withLetter ? pickLetter() : null);
    setLetterSeen(!withLetter);
    setAlive(players.map((p) => p.id));
  }

  const aliveList = players.filter((p) => alive.includes(p.id));

  if (topics.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">3 مواضيع + حرف واحد. اربطهم كلهم!</p>
        <PopButton onClick={start} className="w-full">ابدأ الهاتريك 🎩</PopButton>
      </div>
    );
  }

  if (withLetter && !letterSeen && letter) {
    return <LetterCard letter={letter} onDone={() => setLetterSeen(true)} />;
  }

  if (aliveList.length === 1) {
    return <WinnerScreen name={aliveList[0].name} pts={10} onAward={() => addScore(aliveList[0].id, 10)} onAgain={start} />;
  }

  return (
    <div className="space-y-4">
      <div className="card-splash rounded-3xl p-3 shadow-xl">
        <div className="rounded-2xl bg-cream p-4">
          {letter && hasLetter && (
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
      <div className="rounded-3xl bg-card p-4 space-y-3">
        <p className="text-center font-bold text-ink">اختر اللي فشل في الهاتريك:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {aliveList.map((p) => (
            <button
              key={p.id}
              onClick={() => setAlive(alive.filter((id) => id !== p.id))}
              className="rounded-full bg-destructive/10 px-4 py-2 font-bold text-sm text-ink border-2 border-destructive/40 hover:bg-destructive hover:text-white"
            >
              {p.name} خرج ✗
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ MODE 5: CHAIN ============ */
function ChainMode() {
  const { players, addScore } = useGame();
  const withLetter = useLetterMode();
  const [topic, setTopic] = useState<TopicCard | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterSeen, setLetterSeen] = useState(false);
  const [last, setLast] = useState<string>("");
  const [alive, setAlive] = useState<string[]>(players.map((p) => p.id));

  function start() {
    setTopic(pickTopic(withLetter ? true : undefined));
    setLetter(withLetter ? pickLetter() : null);
    setLetterSeen(!withLetter);
    setLast("");
    setAlive(players.map((p) => p.id));
  }

  const aliveList = players.filter((p) => alive.includes(p.id));

  if (!topic) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-2xl bg-card p-4 text-ink">كل لاعب يقول كلمة تبدأ بآخر حرف في الكلمة اللي قبله. (ة و ء تتجاهل)</p>
        <PopButton onClick={start} className="w-full">ابدأ السلسلة 🔗</PopButton>
      </div>
    );
  }

  if (withLetter && !letterSeen && letter) {
    return <LetterCard letter={letter} onDone={() => setLetterSeen(true)} />;
  }

  if (aliveList.length === 1) {
    return <WinnerScreen name={aliveList[0].name} pts={10} onAward={() => addScore(aliveList[0].id, 10)} onAgain={start} />;
  }

  function lastLetter(word: string) {
    let w = word.trim();
    while (w.length && ["ة", "و", "ء", "ى"].includes(w[w.length - 1])) w = w.slice(0, -1);
    return w[w.length - 1] || "";
  }

  return (
    <div className="space-y-4">
      <DrawCard topic={topic} letter={letter} badge="السلسلة 🔗" />
      <div className="rounded-3xl bg-card p-4 text-center space-y-3">
        <p className="text-sm text-muted-foreground">آخر كلمة:</p>
        <input
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="اكتب الكلمة"
          className="w-full rounded-2xl border-2 border-input bg-muted px-3 py-2 text-center text-2xl font-black text-ink outline-none"
        />
        {last && (
          <p className="text-lg font-bold text-primary">
            اللي بعده يبدأ بحرف:{" "}
            <span className="rounded-full bg-accent px-3 py-1 text-2xl text-ink">{lastLetter(last) || "؟"}</span>
          </p>
        )}
        <p className="pt-2 font-bold text-ink">اختر اللي فشل:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {aliveList.map((p) => (
            <button
              key={p.id}
              onClick={() => { setAlive(alive.filter((id) => id !== p.id)); setLast(""); }}
              className="rounded-full bg-destructive/10 px-4 py-2 font-bold text-sm text-ink border-2 border-destructive/40 hover:bg-destructive hover:text-white"
            >
              {p.name} خرج ✗
            </button>
          ))}
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
