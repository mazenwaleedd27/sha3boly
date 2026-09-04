import { createServerFn } from "@tanstack/react-start";

type Payload = {
  password: string;
  cards: { name: string; desc: string; kind: string; emoji: string }[];
  topics: { title: string; hint: string; needsLetter: boolean; category: string }[];
  letters: string[];
  modes: {
    id: string;
    name: string;
    subtitle: string;
    emoji: string;
    desc: string;
    rules: string[];
  }[];
};

function checkPassword(input: string) {
  const expected = process.env["ADMIN_PASSWORD"] ?? "221976";
  if (input !== expected) throw new Error("الباسورد غلط");
}

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"] ?? "221976";
    return { ok: data.password === expected };
  });

export const saveAdminContent = createServerFn({ method: "POST" })
  .inputValidator((data: Payload) => data)
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nil = "00000000-0000-0000-0000-000000000000";

    await supabaseAdmin.from("game_cards").delete().neq("id", nil);
    if (data.cards.length) {
      const { error } = await supabaseAdmin.from("game_cards").insert(
        data.cards.map((c, i) => ({
          name: c.name,
          description: c.desc,
          kind: c.kind,
          emoji: c.emoji,
          sort: i,
        })),
      );
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin.from("game_topics").delete().neq("id", nil);
    if (data.topics.length) {
      const { error } = await supabaseAdmin.from("game_topics").insert(
        data.topics.map((t, i) => ({
          title: t.title,
          hint: t.hint,
          needs_letter: t.needsLetter,
          category: t.category,
          sort: i,
        })),
      );
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin.from("game_letters").delete().neq("id", nil);
    if (data.letters.length) {
      const { error } = await supabaseAdmin
        .from("game_letters")
        .insert(data.letters.map((l, i) => ({ letter: l, sort: i })));
      if (error) throw new Error(error.message);
    }

    if (data.modes.length) {
      const { error } = await supabaseAdmin.from("game_modes").upsert(
        data.modes.map((m, i) => ({
          mode_id: m.id,
          name: m.name,
          subtitle: m.subtitle,
          emoji: m.emoji,
          description: m.desc,
          rules: m.rules,
          sort: i,
        })),
        { onConflict: "mode_id" },
      );
      if (error) throw new Error(error.message);
    }

    return { ok: true as const };
  });
