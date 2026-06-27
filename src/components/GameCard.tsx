import type { ReactNode } from "react";

// كارت بنفس تصميم الكروت الورقية: إطار splash ملون + بانل أبيض + شارة دائرية صفرا فوق
export function GameCard({
  badge,
  children,
  footer,
}: {
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="card-splash relative mx-auto w-full max-w-sm rounded-[2rem] p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]">
      {badge && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-white bg-accent shadow-lg">
            {badge}
          </div>
        </div>
      )}
      <div className="mt-10 rounded-2xl bg-cream p-5 text-center shadow-inner">{children}</div>
      {footer && (
        <div className="mt-3 rounded-2xl bg-cream p-4 text-center shadow-inner">{footer}</div>
      )}
    </div>
  );
}

export function PopButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    ghost: "bg-white/80 text-ink",
  }[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-pop btn-pop-active rounded-2xl px-6 py-3 font-display text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
