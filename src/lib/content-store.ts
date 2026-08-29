// مخزن المحتوى: بيتحمّل من قاعدة البيانات (Lovable Cloud) ويتكاش في الذاكرة
import { supabase } from "@/integrations/supabase/client";
import {
  ARABIC_LETTERS,
  TOPICS,
  POWER_CARDS,
  type TopicCard,
  type PowerCard,
} from "./game-data";

let topicsCache: TopicCard[] | null = null;
let cardsCache: PowerCard[] | null = null;
let lettersCache: string[] | null = null;

let loadPromise: Promise<void> | null = null;

/** بيحمّل كل المحتوى من الداتابيز مرة واحدة */
export async function loadContent(force = false): Promise<void> {
  if (force) loadPromise = null;
  if (!loadPromise) {
    loadPromise = (async () => {
      const [t, c, l] = await Promise.all([
        supabase.from("game_topics").select("*").order("sort", { ascending: true }),
        supabase.from("game_cards").select("*").order("sort", { ascending: true }),
        supabase.from("game_letters").select("*").order("sort", { ascending: true }),
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
  await Promise.all([saveTopics(TOPICS), savePowerCards(POWER_CARDS), saveLetters(ARABIC_LETTERS)]);
  await loadContent(true);
}
