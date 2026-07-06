import { create } from "zustand";
import { POWER_CARDS, type PowerCard, type GameMode } from "./game-data";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type Player = {
  id: string;
  name: string;
  score: number;
  cards: PowerCard[];
};

type State = {
  players: Player[];
  mode: GameMode | null;
  setPlayers: (p: Player[]) => void;
  setMode: (m: GameMode) => void;
  addScore: (id: string, delta: number) => void;
  giveRandomCard: (id: string) => void;
  removeCard: (id: string, idx: number) => void;
  clearAllCards: () => void;
  resetScores: () => void;

};

export const useGame = create<State>((set) => ({
  players: [],
  mode: null,
  setPlayers: (players) => set({ players }),
  setMode: (mode) => set({ mode }),
  addScore: (id, delta) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === id ? { ...p, score: p.score + delta } : p)),
    })),
  giveRandomCard: (id) =>
    set((s) => {
      const card = POWER_CARDS[Math.floor(Math.random() * POWER_CARDS.length)];
      return {
        players: s.players.map((p) =>
          p.id === id && p.cards.length < 2 ? { ...p, cards: [...p.cards, card] } : p,
        ),
      };
    }),
  removeCard: (id, idx) =>
    set((s) => ({
      players: s.players.map((p) =>
        p.id === id ? { ...p, cards: p.cards.filter((_, i) => i !== idx) } : p,
      ),
    })),
  clearAllCards: () =>
    set((s) => ({ players: s.players.map((p) => ({ ...p, cards: [] })) })),

  resetScores: () =>
    set((s) => ({ players: s.players.map((p) => ({ ...p, score: 0, cards: [] })) })),
}));
