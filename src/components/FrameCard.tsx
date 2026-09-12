import type { ReactNode } from "react";
import frameUrl from "@/assets/card-frame.png";

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
      className={`relative mx-auto w-full max-w-[18rem] ${className}`}
      style={{ aspectRatio: "1024 / 1500" }}
    >
      <img
        src={frameUrl}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        draggable={false}
      />

      {/* الدائرة الصفرا فوق - مكان البادج */}
      {badge && (
        <div className="absolute left-1/2 top-[16%] z-10 flex h-[13%] w-[13%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center text-ink font-black leading-tight">
          {badge}
        </div>
      )}

      {/* المنطقة البيضا */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ paddingTop: "23%", paddingBottom: "13%", paddingLeft: "15%", paddingRight: "15%" }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
          {children}
        </div>
      </div>
    </div>
  );
}

