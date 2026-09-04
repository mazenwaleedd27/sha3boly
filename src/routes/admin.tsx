import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PopButton } from "@/components/GameCard";
import { useServerFn } from "@tanstack/react-start";
import { saveAdminContent, verifyAdminPassword } from "@/lib/admin.functions";
import {
  ARABIC_LETTERS,
  GAME_MODES,
  POWER_CARDS,
  TOPICS,
  type GameMode,
  type PowerCard,
  type TopicCard,
} from "@/lib/game-data";
import {
  getLetters,
  getModes,
  getPowerCards,
  getTopics,
  loadContent,
} from "@/lib/content-store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة التحكم — شعبولي" },
      { name: "description", content: "لوحة تحكم خاصة لإدارة كروت القوة والتلبيس والمواضيع والحروف في لعبة شعبولي." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة التحكم — شعبولي" },
      { property: "og:description", content: "إدارة محتوى لعبة شعبولي: الكروت والمواضيع والحروف." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

const PW_KEY = "shaabouly_admin_pw";

function AdminPage() {
  const verify = useServerFn(verifyAdminPassword);
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) setPassword(saved);
  }, []);

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const { ok } = await verify({ data: { password: input } });
      if (!ok) {
        setErr("الباسورد غلط");
        return;
      }
      sessionStorage.setItem(PW_KEY, input);
      setPassword(input);
    } catch {
      setErr("حصلت مشكلة، جرّب تاني");
    } finally {
      setBusy(false);
    }
  }

  if (!password) {
    return (
      <div className="min-h-screen bg-page">
        <SiteNav />
        <div className="mx-auto max-w-sm px-4 py-14">
          <div className="rounded-3xl bg-cream p-6 shadow-xl">
            <h1 className="text-center font-display text-2xl font-black text-ink">🔐 لوحة التحكم</h1>
            <p className="mt-2 text-center text-sm text-ink/70">اكتب الباسورد عشان تدخل</p>
            <input
              type="password"
              dir="ltr"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              placeholder="Password"
              className="mt-5 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-center outline-none focus:border-primary"
            />
            {err && <p className="mt-3 text-center text-sm font-bold text-red-600">{err}</p>}
            <PopButton className="mt-4 w-full" onClick={() => void submit()}>
              {busy ? "..." : "دخول"}
            </PopButton>
          </div>
        </div>
      </div>
    );
  }

  return <AdminPanel password={password} />;
}



type Tab = "cards" | "topics" | "letters" | "modes";

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("cards");
  const [cards, setCards] = useState<PowerCard[]>([]);
  const [topics, setTopicsState] = useState<TopicCard[]>([]);
  const [letters, setLettersState] = useState<string[]>([]);
  const [modes, setModesState] = useState<GameMode[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(true);

  function hydrate() {
    setCards(getPowerCards());
    setTopicsState(getTopics());
    setLettersState(getLetters());
    setModesState(getModes().map((m) => ({ ...m, rules: [...m.rules] })));
  }

  useEffect(() => {
    loadContent(true).then(() => {
      hydrate();
      setBusy(false);
    });
  }, []);

  async function saveAll() {
    setBusy(true);
    try {
      await savePowerCards(cards);
      await saveTopics(topics);
      await saveLetters(letters);
      await saveModes(modes);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e: any) {
      console.error(e);
      alert(`حصلت مشكلة في الحفظ: ${e?.message ?? e}`);

    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "cards", label: `الكروت (${cards.length})` },
    { id: "topics", label: `المواضيع (${topics.length})` },
    { id: "letters", label: `الحروف (${letters.length})` },
    { id: "modes", label: `قواعد الألعاب (${modes.length})` },
  ];

  return (
    <div className="min-h-screen bg-page pb-24">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-black text-ink">⚙️ لوحة التحكم</h1>
          <div className="flex gap-2">
            <PopButton variant="accent" onClick={saveAll}>
              {busy ? "..." : saved ? "اتحفظ ✓" : "حفظ"}
            </PopButton>
            <PopButton
              variant="ghost"
              onClick={async () => {
                if (confirm("هترجع كل المحتوى للأصلي؟")) {
                  setBusy(true);
                  await resetAll();
                  hydrate();
                  setBusy(false);
                }
              }}
            >
              رجوع للأصلي
            </PopButton>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-bold ${
                tab === t.id ? "bg-nav text-white" : "bg-white/70 text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "cards" && (
          <div className="mt-5 space-y-3">
            {cards.map((c, i) => (
              <div key={i} className="rounded-2xl bg-cream p-4 shadow">
                <div className="flex gap-2">
                  <input
                    value={c.emoji}
                    onChange={(e) =>
                      setCards(cards.map((x, j) => (j === i ? { ...x, emoji: e.target.value } : x)))
                    }
                    className="w-14 rounded-xl border-2 border-ink/10 bg-white px-2 py-2 text-center"
                  />
                  <input
                    value={c.name}
                    onChange={(e) =>
                      setCards(cards.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                    }
                    placeholder="اسم الكارت"
                    className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 bg-white px-3 py-2 font-bold"
                  />
                  <select
                    value={c.kind}
                    onChange={(e) =>
                      setCards(
                        cards.map((x, j) =>
                          j === i ? { ...x, kind: e.target.value as PowerCard["kind"] } : x,
                        ),
                      )
                    }
                    className="rounded-xl border-2 border-ink/10 bg-white px-2 py-2 font-bold"
                  >
                    <option value="power">قوة</option>
                    <option value="trap">تلبيس</option>
                  </select>
                </div>
                <textarea
                  value={c.desc}
                  onChange={(e) =>
                    setCards(cards.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))
                  }
                  placeholder="الوصف"
                  rows={2}
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2"
                />
                <button
                  onClick={() => setCards(cards.filter((_, j) => j !== i))}
                  className="mt-2 rounded-xl bg-red-500 px-3 py-1 text-sm font-bold text-white"
                >
                  حذف
                </button>
              </div>
            ))}
            <PopButton
              className="w-full"
              onClick={() =>
                setCards([...cards, { name: "", desc: "", kind: "power", emoji: "✨" }])
              }
            >
              + كارت جديد
            </PopButton>
          </div>
        )}

        {tab === "topics" && (
          <div className="mt-5 space-y-3">
            {topics.map((t, i) => (
              <div key={i} className="rounded-2xl bg-cream p-4 shadow">
                <div className="flex gap-2">
                  <input
                    value={t.title}
                    onChange={(e) =>
                      setTopicsState(
                        topics.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                      )
                    }
                    placeholder="الموضوع"
                    className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 bg-white px-3 py-2 font-bold"
                  />
                  <input
                    value={t.category}
                    onChange={(e) =>
                      setTopicsState(
                        topics.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)),
                      )
                    }
                    placeholder="التصنيف"
                    className="w-28 rounded-xl border-2 border-ink/10 bg-white px-2 py-2"
                  />
                </div>
                <input
                  value={t.hint}
                  onChange={(e) =>
                    setTopicsState(
                      topics.map((x, j) => (j === i ? { ...x, hint: e.target.value } : x)),
                    )
                  }
                  placeholder="التلميح"
                  className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2"
                />
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 font-bold text-ink">
                    <input
                      type="checkbox"
                      checked={t.needsLetter}
                      onChange={(e) =>
                        setTopicsState(
                          topics.map((x, j) =>
                            j === i ? { ...x, needsLetter: e.target.checked } : x,
                          ),
                        )
                      }
                    />
                    محتاج حرف
                  </label>
                  <button
                    onClick={() => setTopicsState(topics.filter((_, j) => j !== i))}
                    className="rounded-xl bg-red-500 px-3 py-1 text-sm font-bold text-white"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
            <PopButton
              className="w-full"
              onClick={() =>
                setTopicsState([
                  ...topics,
                  { title: "", hint: "", needsLetter: true, category: "متنوع" },
                ])
              }
            >
              + موضوع جديد
            </PopButton>
          </div>
        )}

        {tab === "letters" && (
          <div className="mt-5 rounded-2xl bg-cream p-4 shadow">
            <div className="flex flex-wrap gap-2">
              {letters.map((l, i) => (
                <div key={i} className="flex items-center gap-1 rounded-xl bg-white px-2 py-1">
                  <input
                    value={l}
                    onChange={(e) =>
                      setLettersState(letters.map((x, j) => (j === i ? e.target.value : x)))
                    }
                    className="w-10 bg-transparent text-center text-lg font-black outline-none"
                  />
                  <button
                    onClick={() => setLettersState(letters.filter((_, j) => j !== i))}
                    className="text-sm font-bold text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <PopButton className="mt-4 w-full" onClick={() => setLettersState([...letters, "ا"])}>
              + حرف
            </PopButton>
          </div>
        )}

        {tab === "modes" && (
          <div className="mt-5 space-y-4">
            {modes.map((m, i) => {
              const upd = (patch: Partial<GameMode>) =>
                setModesState(modes.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={m.id || i} className="rounded-2xl bg-cream p-4 shadow">
                  <div className="flex gap-2">
                    <input
                      value={m.emoji}
                      onChange={(e) => upd({ emoji: e.target.value })}
                      className="w-14 rounded-xl border-2 border-ink/10 bg-white px-2 py-2 text-center"
                    />
                    <input
                      value={m.name}
                      onChange={(e) => upd({ name: e.target.value })}
                      placeholder="اسم اللعبة"
                      className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 bg-white px-3 py-2 font-bold"
                    />
                  </div>
                  <input
                    value={m.subtitle}
                    onChange={(e) => upd({ subtitle: e.target.value })}
                    placeholder="العنوان الفرعي"
                    className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2"
                  />
                  <textarea
                    value={m.desc}
                    onChange={(e) => upd({ desc: e.target.value })}
                    placeholder="وصف اللعبة"
                    rows={2}
                    className="mt-2 w-full rounded-xl border-2 border-ink/10 bg-white px-3 py-2"
                  />
                  <p className="mt-3 text-sm font-black text-ink/70">📜 القواعد</p>
                  <div className="mt-1 space-y-2">
                    {m.rules.map((r, k) => (
                      <div key={k} className="flex gap-2">
                        <textarea
                          value={r}
                          onChange={(e) =>
                            upd({ rules: m.rules.map((x, q) => (q === k ? e.target.value : x)) })
                          }
                          rows={2}
                          className="min-w-0 flex-1 rounded-xl border-2 border-ink/10 bg-white px-3 py-2 text-sm"
                        />
                        <button
                          onClick={() => upd({ rules: m.rules.filter((_, q) => q !== k) })}
                          className="shrink-0 self-start rounded-xl bg-red-500 px-3 py-2 text-sm font-bold text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <PopButton variant="ghost" onClick={() => upd({ rules: [...m.rules, ""] })}>
                      + قاعدة
                    </PopButton>
                    <span className="text-xs font-bold text-ink/50">ID: {m.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
