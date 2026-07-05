import { useEffect, useState } from "react";

export function FullscreenButton({ className = "" }: { className?: string }) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggle() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        // Try to lock to portrait on mobile
        const orientation = (screen as unknown as { orientation?: { lock?: (o: string) => Promise<void> } }).orientation;
        if (orientation?.lock) {
          try { await orientation.lock("portrait"); } catch { /* not supported */ }
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* user rejected or unsupported */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFs ? "خروج من ملء الشاشة" : "ملء الشاشة"}
      title={isFs ? "خروج من ملء الشاشة" : "ملء الشاشة"}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/95 text-lg text-ink shadow ${className}`}
    >
      {isFs ? "🡾" : "⛶"}
    </button>
  );
}
