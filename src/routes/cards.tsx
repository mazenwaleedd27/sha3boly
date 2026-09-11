import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { loadContent, getPowerCards, getTopics, getLetters } from "@/lib/content-store";
import type { PowerCard, TopicCard } from "@/lib/game-data";

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "كروت شعبولي — القوة والتلبيس والمواضيع" },
      {
        name: "description",
        content: "اتفرج على كل كروت لعبة شعبولي: كروت القوة، كروت التلبيس، كروت المواضيع، وحروف اللعب.",
      },
      { property: "og:title", content: "كروت شعبولي" },
      {
        property: "og:description",
        content: "كل كروت القوة والتلبيس والمواضيع والحروف في مكان واحد على موبايلك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CardsPage,
});

type Tab = "power" | "trap" | "topics" | "letters";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "power", label: "قوة", emoji: "⚡" },
  { id: "trap", label: "تلبيس", emoji: "💣" },
  { id: "topics", label: "مواضيع", emoji: "📚" },
  { id: "letters", label: "حروف", emoji: "🔤" },
];

function CardsPage() {
  const [tab, setTab] = useState<Tab>("power");
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<PowerCard[]>([]);
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    loadContent().then(() => {
      if (!alive) return;
      setCards(getPowerCards());
      setTopics(getTopics());
      setLetters(getLetters());
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const power = cards.filter((c) => c.kind === "power");
  const trap = cards.filter((c) => c.kind === "trap");

  return (
    <div className="min-h-screen hero-splash">
      <SiteNav />

      <main
        className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6"
        style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}
      >
        <h1 className="pop-title text-center block mb-4">الكروت</h1>

        <div className="mb-5 grid grid-cols-4 gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-2xl px-2 py-3 text-sm font-black btn-pop btn-pop-active ${
                tab === t.id ? "bg-nav text-white" : "bg-cream text-ink"
              }`}
            >
              <span className="block text-xl">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-3xl bg-cream/90 p-10 text-center text-lg font-bold text-ink">
            بنحمّل الكروت… ⏳
          </div>
        ) : tab === "letters" ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {letters.map((l, i) => (
              <div
                key={`${l}-${i}`}
                className="flex aspect-square items-center justify-center rounded-2xl bg-cream text-4xl font-black text-ink shadow"
              >
                {l}
              </div>
            ))}
          </div>
        ) : tab === "topics" ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topics.map((t, i) => (
              <div key={`${t.title}-${i}`} className="rounded-3xl bg-cream p-4 shadow">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-black text-ink">{t.title}</h2>
                  <span className="rounded-full bg-nav px-3 py-1 text-xs font-bold text-white">
                    {t.category}
                  </span>
                </div>
                <p className="mt-2 text-base text-ink/80">{t.hint}</p>
                <p className="mt-2 text-sm font-bold text-ink/60">
                  {t.needsLetter ? "🔤 محتاج حرف" : "🚫 من غير حرف"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(tab === "power" ? power : trap).map((c, i) => (
              <div key={`${c.name}-${i}`} className="rounded-3xl bg-cream p-4 shadow">
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{c.emoji}</span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-black text-ink">{c.name}</h2>
                    <p className="mt-1 text-base leading-relaxed text-ink/80">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
