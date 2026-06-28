import type { ReactNode } from "react";
import frame from "@/assets/card-frame.png.asset.json";

// كارت بإطار splash ملون مع دائرة صفرا في النص فوق — الصورة جاية من اللي رفعها المستخدم
export function FrameCard({
  badge,
  children,
  className = "",
}: {
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[20rem] ${className}`}
      style={{ aspectRatio: "1024 / 1500" }}
    >
      <img
        src={frame.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        draggable={false}
      />

      {/* الدائرة الصفرا فوق - مكان البادج */}
      {badge && (
        <div className="absolute left-1/2 top-[14%] z-10 flex h-[15%] w-[15%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-ink font-black leading-tight">
          {badge}
        </div>
      )}

      {/* المنطقة البيضا */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ padding: "26% 14% 13%" }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}
