CREATE TABLE public.game_modes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode_id text NOT NULL UNIQUE,
  name text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🎮',
  description text NOT NULL DEFAULT '',
  rules text[] NOT NULL DEFAULT '{}',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.game_modes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_modes TO authenticated;
GRANT ALL ON public.game_modes TO service_role;

ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read game_modes" ON public.game_modes FOR SELECT USING (true);
CREATE POLICY "admins manage game_modes" ON public.game_modes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_game_modes_updated_at BEFORE UPDATE ON public.game_modes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.game_modes (mode_id, name, subtitle, emoji, description, rules, sort) VALUES
('auction','المزاد','ثقة ومخاطرة','🎯','زايد على عدد الإجابات اللي تقدر تقولها. اللي يكسب المزاد يجاوب — ولو فشل يخسر نفس النقاط.',
 ARRAY['اللعبة 5 جولات. كل جولة بنسحب موضوع وحرف.','كل لاعب يزايد بعدد الإجابات اللي يقدر يقولها.','1–10 إجابات = 10 نقط · 11–20 = 20 نقطة · 21+ = 30 نقطة.','اللي يكسب المزاد يجاوب. لو نجح يكسب النقط، لو فشل يخسر نفس النقط.','تقدر تستخدم كروت القوة على نفسك أو التلبيس على غيرك في أي وقت.'],0),
('survival','البقاء للأسرع','3 ثواني بس','⚡','دور سريع بين اللاعبين. اللي يتأخر أو يكرر إجابة يخرج. آخر واحد فايز.',
 ARRAY['بنسحب موضوع واحد ويبدأ الدور يلف على اللاعبين.','كل لاعب عنده 3 ثواني بس يقول إجابة جديدة.','اللي يتأخر أو يكرر إجابة قيلت قبل كده — يخرج.','آخر لاعب صامد يكسب 10 نقط.'],1),
('pingpong','البينج بونج','وش لوش','🏓','كل اتنين في مواجهة. ردة في 5 ثواني. الفائزين يكملوا لحد ما يتبقى بطل واحد.',
 ARRAY['اللاعبين بيتقسموا أزواج بشكل عشوائي.','كل زوج بياخد موضوع وبيتراشقوا إجابات (5 ثواني للرد).','أول واحد يقف أو يكرر — يخسر المواجهة.','الفايزين يكملوا لحد ما يفضل بطل واحد ياخد 10 نقط.'],2),
('hattrick','هاتريك','3 مواضيع بحرف واحد','🎩','اربط حرف واحد بـ 3 مواضيع في 10 ثواني. ضغط أعصاب مضاعف.',
 ARRAY['كل دور بيطلع 3 مواضيع + حرف واحد.','اللاعب لازم يقول إجابة لكل موضوع تبدأ بنفس الحرف، في 10 ثواني.','لو قفل التلاتة يكمل، لو وقف في واحد منهم يخرج.','آخر واحد صامد ياخد 10 نقط.'],3),
('chain','السلسلة','آخر حرف = أول حرف','🔗','كل لاعب يقول كلمة تبدأ بآخر حرف في الكلمة اللي قبله. 3 ثواني بس للتفكير.',
 ARRAY['بنسحب موضوع واحد لكل الجولة.','كل لاعب يقول كلمة تبدأ بآخر حرف من كلمة اللاعب اللي قبله.','(الحروف ة، و، ء، ى بتتجاهل من آخر الكلمة)','عندك 3 ثواني بس. اللي يقف أو يكرر — يخرج.','آخر صامد ياخد 10 نقط.'],4);