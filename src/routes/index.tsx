import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import logoAsset from "@/assets/logo.png.asset.json";
import mazenChar from "@/assets/mazen-character.png";

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

function Home() {
  return (
    <main className="min-h-dvh bg-[#FFB800]">
      <SiteNav active="home" />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-splash px-5 pb-24 pt-10">
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
                <Stat icon="👥" top="2-12" bottom="لاعبين" />
                <Stat icon="🕐" top="15-30" bottom="دقيقة" />
                <Stat icon="🧒" top="+8" bottom="سنوات" />
              </div>
            </div>

            {/* Right column: two clean rows of letters */}
            <div className="mx-auto hidden w-full max-w-md space-y-4 md:block">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l: "م", c: "bg-splash-teal", r: "-rotate-6" },
                  { l: "ا", c: "bg-splash-yellow", r: "rotate-3" },
                  { l: "ز", c: "bg-splash-pink", r: "-rotate-3" },
                  { l: "ن", c: "bg-splash-orange", r: "rotate-6" },
                ].map((x) => (
                  <div
                    key={`m-${x.l}`}
                    className={`flex h-28 items-center justify-center rounded-2xl border-4 border-white text-5xl font-black text-white shadow-2xl ${x.c} ${x.r}`}
                  >
                    {x.l}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l: "و", c: "bg-splash-orange", r: "rotate-6" },
                  { l: "ل", c: "bg-splash-pink", r: "-rotate-3" },
                  { l: "ي", c: "bg-splash-yellow", r: "rotate-3" },
                  { l: "د", c: "bg-splash-teal", r: "-rotate-6" },
                ].map((x) => (
                  <div
                    key={`w-${x.l}`}
                    className={`flex h-28 items-center justify-center rounded-2xl border-4 border-white text-5xl font-black text-white shadow-2xl ${x.c} ${x.r}`}
                  >
                    {x.l}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Character + CTA */}
          <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-3">
            <img
              src={mazenChar}
              alt="مازن وليد"
              className="h-44 w-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)] md:h-56"
            />
            <Link
              to="/start"
              className="btn-pop btn-pop-active inline-flex items-center gap-3 rounded-full bg-nav px-12 py-5 text-2xl font-black text-white shadow-xl"
            >
              🎮 ابدأ اللعب الآن
            </Link>
            <a href="#about" className="text-sm font-bold text-nav underline">
              ↓ اعرف المزيد
            </a>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="mx-auto max-w-4xl px-5 pt-14">
        <div className="rounded-3xl bg-white p-8 shadow-md text-center">
          <h2 className="text-3xl text-nav">قصتي</h2>
          <p className="mt-4 text-lg font-bold leading-loose text-ink/80">
            أنا بشمهندس مازن وليد، حبيت أعمل لعبة تجمع العيلة والأصحاب في جلسة واحدة
            مليانة ضحك ومنافسة. شعبولي اتولدت من حب الحروف العربية ومن إحساس إن أحلى
            الأوقات بتبقى لما نلعب مع بعض من غير شاشات كتير. اللعبة دي إهداء لكل بيت
            بيحب الفرفشة والذكاء.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-4xl px-5 py-14">
        <div className="rounded-3xl bg-white p-8 shadow-md scroll-mt-20">
          <h2 className="mb-4 text-center text-3xl text-nav">عن اللعبة</h2>
          <p className="text-center font-bold leading-relaxed text-ink/80">
            شعبولي لعبة عائلية سريعة بتجمع الذكاء والحظ والضحك. كل لاعب بيسحب بطاقات حروف
            وبيستخدم كروت قوة وحماية وتلبيس عشان يكسب الجولة. من موبايل واحد، تقدروا تلعبوا
            بـ ٥ طرق مختلفة وتتنافسوا لحد ما يطلع البطل.
          </p>
          <Link
            to="/start"
            className="mt-6 mx-auto block w-fit rounded-2xl bg-cta px-8 py-3 text-center text-xl font-black text-ink btn-pop btn-pop-active"
          >
            يلا نبدأ 🎴
          </Link>
        </div>
      </section>

      <footer className="bg-nav py-6 text-center text-sm font-bold text-white/90">
        شعبولي · بشمهندس مازن وليد · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
