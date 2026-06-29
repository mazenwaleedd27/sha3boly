import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";

export function SiteNav({ active = "home" }: { active?: "home" | "play" }) {
  return (
    <nav className="bg-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="shrink-0">
          <img src={logoAsset.url} alt="شعبولي" className="h-12 w-auto drop-shadow" />
        </Link>
        <ul className="hidden items-center gap-6 text-white font-bold md:flex">
          <li><a href="#about" className="opacity-90 hover:opacity-100">عن اللعبة</a></li>
          <li><a href="#how" className="opacity-90 hover:opacity-100">طريقة اللعبة</a></li>
          <li><a href="#cards" className="opacity-90 hover:opacity-100">المحتويات</a></li>
          <li><a href="#faq" className="opacity-90 hover:opacity-100">الأسئلة الشائعة</a></li>
          <li><a href="#contact" className="opacity-90 hover:opacity-100">تواصل معنا</a></li>
          <li>
            <Link
              to="/"
              className={`rounded-full px-5 py-2 ${active === "home" ? "bg-cta text-ink" : "opacity-90"}`}
            >
              الرئيسية
            </Link>
          </li>
        </ul>
        <Link
          to="/start"
          className="rounded-full bg-cta px-4 py-2 font-black text-ink shadow md:hidden"
        >
          ابدأ
        </Link>
      </div>
    </nav>
  );
}
