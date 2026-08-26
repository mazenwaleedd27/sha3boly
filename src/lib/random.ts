import { type TopicCard } from "@/lib/game-data";
import { getLetters, getTopics } from "@/lib/content-store";

export function pickLetter(exclude: string[] = []): string {
  const pool = getLetters().filter((l) => !exclude.includes(l));
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickTopic(needsLetter?: boolean): TopicCard {
  const all = getTopics();
  const pool = needsLetter === undefined ? all : all.filter((t) => t.needsLetter === needsLetter);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickTopics(n: number, needsLetter?: boolean): TopicCard[] {
  const all = getTopics();
  const pool = needsLetter === undefined ? [...all] : all.filter((t) => t.needsLetter === needsLetter);
  const out: TopicCard[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
