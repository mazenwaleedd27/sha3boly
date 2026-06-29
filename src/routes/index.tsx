import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "شعبولي — لعبة الحروف والذكاء والضحك العائلية" },
      { name: "description", content: "شعبولي: لعبة حروف عربية للعائلة والأصحاب. اجمع البطاقات، استخدم كروت القوة والحماية، وكن الأسرع." },
      { property: "og:title", content: "شعبولي — لعبة الجماعة" },
      { property: "og:description", content: "موبايل واحد، 5 طرق لعب، كروت قوة وتلبيس، وضحك ومنافسة." },
    ],
  }),
  component: Home,
});

function Stat({ icon, top, bottom }: { icon: string; top: string; bottom: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 shadow">
      <span className="text-2xl">{icon}</span>
      <div className="text-right leading-tight">
        <div className="text-lg font-black text-ink">{top}</div>
        <div className="text-xs font-bold text-ink/70">{bottom}</div>
      </div>
    </div>
  );
}

function HowCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white p-5 text-center shadow-md">
      <div className="text-5xl">{emoji}</div>
      <h3 className="mt-3 text-xl text-nav">{title}</h3>
      <p className="mt-1 text-sm font-bold text-ink/70 leading-snug">{desc}</p>
      <Link
        to="/start"
        className="mt-4 rounded-2xl bg-nav px-6 py-2 font-black text-white btn-pop btn-pop-active"
      >
        العب
      </Link>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="text-3xl">{icon}</div>
      <div className="text-right">
        <div className="font-black text-ink">{title}</div>
        <div className="text-xs font-bold text-ink/65">{desc}</div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <main className="min-h-dvh bg-cream">
      <SiteNav active="home" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-splash wave-bottom px-5 pb-24 pt-10">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
            <div className="text-center md:text-right">
              <img
                src={logoAsset.url}
                alt="شعبولي"
                className="mx-auto h-44 w-auto drop-shadow-[0_6px_0_rgba(0,0,0,0.25)] md:mx-0"
              />
              <p className="mt-4 text-2xl font-black text-ink">
                لعبة الحروف والذكاء والضحك العائلية
              </p>
              <p className="mt-3 text-lg font-bold text-ink/80 leading-relaxed">
                اجمع بطاقات الحروف بسرعة،
                <br />
                واستخدم بطاقات الحركة لتفوز!
              </p>

              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/70 p-3 shadow">
                <Stat icon="👥" top="2-6" bottom="لاعبين" />
                <Stat icon="🕐" top="15-30" bottom="دقيقة" />
                <Stat icon="🧒" top="+8" bottom="سنوات" />
              </div>

              <div className="mt-7 flex flex-col items-center gap-2 md:items-start">
                <Link
                  to="/start"
                  className="btn-pop btn-pop-active inline-flex items-center gap-3 rounded-full bg-nav px-10 py-4 text-2xl font-black text-white shadow-xl"
                >
                  🛒 ابدأ اللعب الآن
                </Link>
                <a href="#how" className="text-sm font-bold text-nav underline">
                  ↓ اعرف المزيد
                </a>
              </div>
            </div>

            {/* Right column: floating cards mosaic */}
            <div className="relative mx-auto hidden h-96 w-full max-w-md md:block">
              {["أ", "م", "ن", "ج", "ب"].map((l, i) => {
                const positions = [
                  "right-4 top-2 rotate-[-8deg] bg-splash-teal",
                  "right-1/3 top-10 rotate-[6deg] bg-splash-yellow",
                  "right-2/3 top-4 rotate-[-12deg] bg-splash-pink",
                  "right-10 bottom-6 rotate-[10deg] bg-splash-orange",
                  "right-1/2 bottom-0 rotate-[-4deg] bg-splash-purple",
                ];
                return (
                  <div
                    key={l}
                    className={`absolute flex h-28 w-20 items-center justify-center rounded-2xl border-4 border-white text-5xl font-black text-white shadow-2xl ${positions[i]}`}
                  >
                    {l}
                  </div>
                );
              })}
              <div className="absolute bottom-10 left-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-3xl shadow-xl">
                💣
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-md md:col-span-2">
            <h2 className="mb-5 text-center text-3xl text-nav">طريقة اللعب</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <HowCard emoji="🔠" title="جمع الحروف" desc="اجمع أكبر عدد من بطاقات الحروف." />
              <HowCard emoji="💣" title="بطاقات الحركة" desc="استخدم البطاقات لتغيير مجرى اللعبة." />
              <HowCard emoji="🛡️" title="بطاقات الحماية" desc="احمِ حروفك من سرقة الآخرين." />
              <HowCard emoji="🏆" title="كن الأسرع" desc="اجمع الحروف وكن الأسرع لتفوز!" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-center text-3xl text-nav">وصف اللعبة</h2>
            <p className="text-center font-bold leading-relaxed text-ink/80">
              شعبولي لعبة عائلية سريعة بتجمع الذكاء والحظ والضحك. كل لاعب بيسحب بطاقات حروف
              وبيستخدم كروت قوة وحماية وتلبيس عشان يكسب الجولة. من موبايل واحد، تقدروا تلعبوا
              بـ ٥ طرق مختلفة وتتنافسوا لحد ما يطلع البطل.
            </p>
            <Link
              to="/start"
              className="mt-5 block rounded-2xl bg-cta px-6 py-3 text-center text-xl font-black text-ink btn-pop btn-pop-active"
            >
              يلا نبدأ 🎴
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl divide-x divide-x-reverse divide-ink/10 px-2 md:grid-cols-4">
          <Feature icon="🛡️" title="آمنة للأطفال" desc="تصميم آمن ومواد عالية الجودة" />
          <Feature icon="🚚" title="شحن سريع" desc="توصيل إلى باب منزلك" />
          <Feature icon="🏅" title="ضمان الجودة" desc="نضمن جودة منتجاتنا" />
          <Feature icon="🎧" title="دعم العملاء" desc="نحن هنا لمساعدتك" />
        </div>
      </section>

      <footer id="contact" className="bg-nav py-6 text-center text-sm font-bold text-white/90">
        شعبولي · بشمهندس مازن وليد · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
