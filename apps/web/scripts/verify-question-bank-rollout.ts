import { createClient } from "@supabase/supabase-js";

import "./load-env";

type CountClient = { from: (table: string) => any };

async function count(
  client: CountClient,
  table: string,
  filters: Array<[string, string | number]>,
): Promise<number> {
  let query = client.from(table).select("id", { count: "exact", head: true });
  for (const [field, value] of filters) query = query.eq(field, value);
  const { count: result, error } = await query;
  if (error) throw error;
  return result ?? 0;
}

async function countHistorical(
  client: CountClient,
  filters: Array<[string, string | number]>,
): Promise<number> {
  let query = client
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("origin", "official_historic")
    .gte("source_year", 2014)
    .lte("source_year", 2018);
  for (const [field, value] of filters) query = query.eq(field, value);
  const { count: result, error } = await query;
  if (error) throw error;
  return result ?? 0;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const results = {
    officialSourceDocuments: await count(client, "official_source_documents", []),
    historicalTotal: await countHistorical(client, []),
    historicalAvailable: await countHistorical(client, [
      ["verification_status", "verified"],
      ["disposition", "available"],
    ]),
    historicalQuarantined: await countHistorical(client, [["disposition", "quarantined"]]),
    oep2024Total: await count(client, "questions", [["oep_year", 2024], ["exam_part", "first_exercise_part_1"]]),
    oep2024Annulled: await count(client, "questions", [["oep_year", 2024], ["exam_part", "first_exercise_part_1"], ["disposition", "annulled"]]),
    oep2024Quarantined: await count(client, "questions", [["oep_year", 2024], ["exam_part", "first_exercise_part_1"], ["disposition", "quarantined"]]),
    oep2025Total: await count(client, "questions", [["oep_year", 2025], ["exam_part", "first_exercise_part_1"]]),
    oep2025Annulled: await count(client, "questions", [["oep_year", 2025], ["exam_part", "first_exercise_part_1"], ["disposition", "annulled"]]),
    oep2025Quarantined: await count(client, "questions", [["oep_year", 2025], ["exam_part", "first_exercise_part_1"], ["disposition", "quarantined"]]),
    practicalTotal: await count(client, "questions", [["exam_part", "first_exercise_part_2"]]),
    practicalQuarantined: await count(client, "questions", [["exam_part", "first_exercise_part_2"], ["disposition", "quarantined"]]),
    allLearnerAvailable: await count(client, "questions", [["verification_status", "verified"], ["disposition", "available"]]),
  };
  const { data: definitiveRows, error: definitiveError } = await client.from("questions")
    .select("question_number,correct_answer,question_role,reserve_disposition,disposition")
    .eq("oep_year", 2025)
    .in("question_number", ["37", "41", "62", "96", "121", "122", "123"]);
  if (definitiveError) throw definitiveError;
  console.log(JSON.stringify({ ...results, definitiveSamples: definitiveRows }, null, 2));
  if (
    results.officialSourceDocuments !== 16 ||
    results.historicalTotal !== 513 ||
    results.historicalAvailable !== 283 ||
    results.historicalQuarantined !== 230 ||
    results.oep2024Total !== 105 ||
    results.oep2024Annulled !== 5 ||
    results.oep2024Quarantined !== 100 ||
    results.oep2025Total !== 125 ||
    results.oep2025Annulled !== 2 ||
    results.oep2025Quarantined !== 123 ||
    results.practicalTotal !== 32 ||
    results.practicalQuarantined !== 32 ||
    results.allLearnerAvailable !== 283
  ) {
    throw new Error("Remote question-bank staging counts do not match the source inventory");
  }
}

void main();
