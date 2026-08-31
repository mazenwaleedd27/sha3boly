import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PopButton } from "@/components/GameCard";
import { supabase } from "@/integrations/supabase/client";
import type { GameMode, PowerCard, TopicCard } from "@/lib/game-data";
import {
  getLetters,
  getModes,
  saveModes,
  getPowerCards,
  getTopics,
  loadContent,
  resetAll,
  saveLetters,
  savePowerCards,
  saveTopics,
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

function AdminPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!alive) return;
      if (!userRes.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userRes.user.id);
      if (!alive) return;
      setState(roles?.some((r) => r.role === "admin") ? "ok" : "denied");
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-page">
        <SiteNav />
        <p className="py-20 text-center font-bold text-ink">جاري التحميل...</p>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen bg-page">
        <SiteNav />
        <div className="mx-auto max-w-sm px-4 py-16">
          <div className="rounded-3xl bg-cream p-6 text-center shadow-xl">
            <h1 className="font-display text-2xl font-black text-ink">🚫 غير مسموح</h1>
            <p className="mt-2 text-sm text-ink/70">الحساب ده مش أدمن.</p>
            <PopButton
              className="mt-4 w-full"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth", replace: true });
              }}
            >
              تسجيل خروج
            </PopButton>
          </div>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}


type Tab = "cards" | "topics" | "letters";

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("cards");
  const [cards, setCards] = useState<PowerCard[]>([]);
  const [topics, setTopicsState] = useState<TopicCard[]>([]);
  const [letters, setLettersState] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(true);

  function hydrate() {
    setCards(getPowerCards());
    setTopicsState(getTopics());
    setLettersState(getLetters());
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
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      console.error(e);
      alert("حصلت مشكلة في الحفظ، جرّب تاني");
    } finally {
      setBusy(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "cards", label: `الكروت (${cards.length})` },
    { id: "topics", label: `المواضيع (${topics.length})` },
    { id: "letters", label: `الحروف (${letters.length})` },
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
      </div>
    </div>
  );
}
