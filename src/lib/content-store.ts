// مخزن المحتوى: بيتحمّل من قاعدة البيانات (Lovable Cloud) ويتكاش في الذاكرة
import { supabase } from "@/integrations/supabase/client";
import {
  ARABIC_LETTERS,
  TOPICS,
  POWER_CARDS,
  GAME_MODES,
  type TopicCard,
  type PowerCard,
  type GameMode,
} from "./game-data";

let topicsCache: TopicCard[] | null = null;
let cardsCache: PowerCard[] | null = null;
let lettersCache: string[] | null = null;
let modesCache: GameMode[] | null = null;

let loadPromise: Promise<void> | null = null;

/** بيحمّل كل المحتوى من الداتابيز مرة واحدة */
export async function loadContent(force = false): Promise<void> {
  if (force) loadPromise = null;
  if (!loadPromise) {
    loadPromise = (async () => {
      const [t, c, l, m] = await Promise.all([
        supabase.from("game_topics").select("*").order("sort", { ascending: true }),
        supabase.from("game_cards").select("*").order("sort", { ascending: true }),
        supabase.from("game_letters").select("*").order("sort", { ascending: true }),
        supabase.from("game_modes").select("*").order("sort", { ascending: true }),
      ]);

      if (t.data) {
        topicsCache = t.data.map((r) => ({
          title: r.title,
          hint: r.hint,
          needsLetter: r.needs_letter,
          category: r.category,
        }));
      }
      if (c.data) {
        cardsCache = c.data.map((r) => ({
          name: r.name,
          desc: r.description,
          kind: (r.kind === "trap" ? "trap" : "power") as PowerCard["kind"],
          emoji: r.emoji,
        }));
      }
      if (l.data) {
        lettersCache = l.data.map((r) => r.letter);
      }
      if (m.data?.length) {
        modesCache = m.data.map((r) => ({
          id: r.mode_id,
          name: r.name,
          subtitle: r.subtitle,
          emoji: r.emoji,
          desc: r.description,
          rules: r.rules ?? [],
        }));
      }
    })().catch((e) => {
      console.error("loadContent failed", e);
      loadPromise = null;
    });
  }
  return loadPromise;
}

export function getTopics(): TopicCard[] {
  return topicsCache?.length ? topicsCache : TOPICS;
}
export function getPowerCards(): PowerCard[] {
  return cardsCache?.length ? cardsCache : POWER_CARDS;
}
export function getLetters(): string[] {
  return lettersCache?.length ? lettersCache : ARABIC_LETTERS;
}

export function getModes(): GameMode[] {
  return modesCache?.length ? modesCache : GAME_MODES;
}

/** بيحفظ قواعد الألعاب (upsert على mode_id) */
export async function saveModes(items: GameMode[]) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess.session) throw new Error("لازم تسجّل دخول بحساب الأدمن الأول");

  const keep = items.map((m) => m.id);
  if (keep.length) {
    const { error } = await supabase.from("game_modes").upsert(
      items.map((m, i) => ({
        mode_id: m.id,
        name: m.name,
        subtitle: m.subtitle,
        emoji: m.emoji,
        description: m.desc,
        rules: m.rules,
        sort: i,
      })),
      { onConflict: "mode_id" },
    );
    if (error) throw error;
    const { error: delErr } = await supabase
      .from("game_modes")
      .delete()
      .not("mode_id", "in", `(${keep.map((k) => `"${k}"`).join(",")})`);
    if (delErr) throw delErr;
  } else {
    const { error } = await supabase
      .from("game_modes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }
  modesCache = [...items];
}


/** بيحفظ المحتوى كله في الداتابيز (استبدال كامل) */
export async function saveTopics(items: TopicCard[]) {
  await supabase.from("game_topics").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (items.length) {
    const { error } = await supabase.from("game_topics").insert(
      items.map((t, i) => ({
        title: t.title,
        hint: t.hint,
        needs_letter: t.needsLetter,
        category: t.category,
        sort: i,
      })),
    );
    if (error) throw error;
  }
  topicsCache = [...items];
}

export async function savePowerCards(items: PowerCard[]) {
  await supabase.from("game_cards").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (items.length) {
    const { error } = await supabase.from("game_cards").insert(
      items.map((c, i) => ({
        name: c.name,
        description: c.desc,
        kind: c.kind,
        emoji: c.emoji,
        sort: i,
      })),
    );
    if (error) throw error;
  }
  cardsCache = [...items];
}

export async function saveLetters(items: string[]) {
  await supabase.from("game_letters").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (items.length) {
    const { error } = await supabase
      .from("game_letters")
      .insert(items.map((l, i) => ({ letter: l, sort: i })));
    if (error) throw error;
  }
  lettersCache = [...items];
}

/** رجوع للمحتوى الأصلي المكتوب في الكود */
export async function resetAll() {
  await Promise.all([
    saveTopics(TOPICS),
    savePowerCards(POWER_CARDS),
    saveLetters(ARABIC_LETTERS),
    saveModes(GAME_MODES),
  ]);
  await loadContent(true);
}
