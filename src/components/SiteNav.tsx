import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FullscreenButton } from "./FullscreenButton";
import { supabase } from "@/integrations/supabase/client";

export function SiteNav({ active = "home" }: { active?: "home" | "play" }) {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  return (
    <nav className="bg-nav" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="shrink-0 neon-brand text-lg sm:text-xl">
          مازن وليد
        </Link>
        <ul className="hidden items-center gap-6 text-white font-bold md:flex">
          <li>
            <Link
              to="/"
              className={`rounded-full px-5 py-2 ${active === "home" ? "bg-cta text-ink" : "opacity-90"}`}
            >
              الرئيسية
            </Link>
          </li>
          <li><a href="#story" className="opacity-90 hover:opacity-100">قصتي</a></li>
          <li><a href="#about" className="opacity-90 hover:opacity-100">عن اللعبة</a></li>
          <li>
            <Link to="/admin" className="opacity-90 hover:opacity-100">لوحة التحكم</Link>
          </li>
          <li>
            {signedIn ? (
              <button onClick={signOut} className="opacity-90 hover:opacity-100">خروج</button>
            ) : (
              <Link to="/auth" className="opacity-90 hover:opacity-100">دخول</Link>
            )}
          </li>
        </ul>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <button
              onClick={signOut}
              aria-label="تسجيل خروج"
              className="rounded-full bg-white/20 px-3 py-2 text-white md:hidden"
            >
              🚪
            </button>
          ) : (
            <Link
              to="/auth"
              aria-label="تسجيل الدخول"
              className="rounded-full bg-white/20 px-3 py-2 text-white md:hidden"
            >
              🔐
            </Link>
          )}
          <FullscreenButton />

          <Link
            to="/start"
            className="rounded-full bg-cta px-4 py-2 font-black text-ink shadow md:hidden"
          >
            ابدأ
          </Link>
        </div>
      </div>
    </nav>
  );
}
