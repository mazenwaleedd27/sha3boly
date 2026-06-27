import { useEffect, useRef, useState } from "react";

export function useTimer(initial: number) {
  const [time, setTime] = useState(initial);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && time > 0) {
      ref.current = setInterval(() => setTime((t) => Math.max(0, t - 1)), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, time]);

  return {
    time,
    running,
    start: () => setRunning(true),
    pause: () => setRunning(false),
    reset: (n = initial) => {
      setRunning(false);
      setTime(n);
    },
    setTime,
  };
}

export function TimerRing({ time, max }: { time: number; max: number }) {
  const pct = (time / max) * 100;
  const danger = time <= 5;
  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={danger ? "var(--destructive)" : "var(--primary)"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 283} 283`}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-display text-6xl font-black ${danger ? "animate-pulse text-destructive" : "text-ink"}`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
