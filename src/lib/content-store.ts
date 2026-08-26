// مخزن المحتوى: بيقرأ من localStorage لو المالك عدّل، وإلا بيرجّع الافتراضي
import {
  ARABIC_LETTERS,
  TOPICS,
  POWER_CARDS,
  type TopicCard,
  type PowerCard,
} from "./game-data";

const KEYS = {
  topics: "shabouly:topics",
  cards: "shabouly:cards",
  letters: "shabouly:letters",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getTopics(): TopicCard[] {
  return read<TopicCard[]>(KEYS.topics, TOPICS);
}
export function setTopics(v: TopicCard[]) {
  write(KEYS.topics, v);
}

export function getPowerCards(): PowerCard[] {
  return read<PowerCard[]>(KEYS.cards, POWER_CARDS);
}
export function setPowerCards(v: PowerCard[]) {
  write(KEYS.cards, v);
}

export function getLetters(): string[] {
  return read<string[]>(KEYS.letters, ARABIC_LETTERS);
}
export function setLetters(v: string[]) {
  write(KEYS.letters, v);
}

export function resetAll() {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}
