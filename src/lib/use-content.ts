import { useEffect, useState } from "react";
import { getModes, loadContent } from "./content-store";
import type { GameMode } from "./game-data";

/** بيرجّع قواعد الألعاب من الداتابيز (مع fallback للمحتوى الأصلي) */
export function useModes(): GameMode[] {
  const [modes, setModes] = useState<GameMode[]>(() => getModes());

  useEffect(() => {
    let alive = true;
    loadContent().then(() => {
      if (alive) setModes(getModes());
    });
    return () => {
      alive = false;
    };
  }, []);

  return modes;
}
