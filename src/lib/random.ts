import { ARABIC_LETTERS, TOPICS, type TopicCard } from "@/lib/game-data";

export function pickLetter(exclude: string[] = []): string {
  const pool = ARABIC_LETTERS.filter((l) => !exclude.includes(l));
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickTopic(needsLetter?: boolean): TopicCard {
  const pool = needsLetter === undefined ? TOPICS : TOPICS.filter((t) => t.needsLetter === needsLetter);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickTopics(n: number, needsLetter?: boolean): TopicCard[] {
  const pool = needsLetter === undefined ? [...TOPICS] : TOPICS.filter((t) => t.needsLetter === needsLetter);
  const out: TopicCard[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
