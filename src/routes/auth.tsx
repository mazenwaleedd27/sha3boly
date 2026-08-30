import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { PopButton } from "@/components/GameCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — شعبولي" },
      { name: "description", content: "سجّل دخولك للوصول إلى لوحة تحكم لعبة شعبولي وإدارة الكروت والمواضيع والحروف." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "تسجيل الدخول — شعبولي" },
      { property: "og:description", content: "دخول خاص بمالك اللعبة لإدارة المحتوى." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else setMsg("افتح إيميلك وأكّد الحساب، وبعدين سجّل دخول.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "حصلت مشكلة، جرّب تاني");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <SiteNav />
      <div className="mx-auto max-w-sm px-4 py-14">
        <div className="rounded-3xl bg-cream p-6 shadow-xl">
          <h1 className="text-center font-display text-2xl font-black text-ink">
            {mode === "in" ? "🔐 تسجيل الدخول" : "🆕 إنشاء حساب"}
          </h1>
          <p className="mt-2 text-center text-sm text-ink/70">الدخول خاص بصاحب اللعبة</p>

          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-5 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 outline-none focus:border-primary"
          />
          <input
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void submit();
            }}
            placeholder="Password"
            className="mt-3 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 outline-none focus:border-primary"
          />

          {err && <p className="mt-3 text-center text-sm font-bold text-red-600">{err}</p>}
          {msg && <p className="mt-3 text-center text-sm font-bold text-green-700">{msg}</p>}

          <PopButton className="mt-4 w-full" onClick={() => void submit()}>
            {busy ? "..." : mode === "in" ? "دخول" : "إنشاء حساب"}
          </PopButton>

          <button
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setErr(null);
              setMsg(null);
            }}
            className="mt-4 w-full text-sm font-bold text-ink/70 underline"
          >
            {mode === "in" ? "معندكش حساب؟ اعمل حساب" : "عندك حساب؟ سجّل دخول"}
          </button>
        </div>
      </div>
    </div>
  );
}
