CREATE TABLE public.game_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  hint text NOT NULL DEFAULT '',
  needs_letter boolean NOT NULL DEFAULT true,
  category text NOT NULL DEFAULT 'متنوع',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.game_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'power',
  emoji text NOT NULL DEFAULT '✨',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.game_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  letter text NOT NULL,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_topics TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_cards TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_letters TO anon, authenticated;
GRANT ALL ON public.game_topics TO service_role;
GRANT ALL ON public.game_cards TO service_role;
GRANT ALL ON public.game_letters TO service_role;

ALTER TABLE public.game_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read topics" ON public.game_topics FOR SELECT USING (true);
CREATE POLICY "anyone can manage topics" ON public.game_topics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anyone can read cards" ON public.game_cards FOR SELECT USING (true);
CREATE POLICY "anyone can manage cards" ON public.game_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anyone can read letters" ON public.game_letters FOR SELECT USING (true);
CREATE POLICY "anyone can manage letters" ON public.game_letters FOR ALL USING (true) WITH CHECK (true);