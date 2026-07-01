import {
  mapQuestionProgressUpdateToRowInput,
  mapRowToQuestionProgressUpdate,
  type QuestionProgressFormUpdate,
  type QuestionProgressUpdate,
} from "./question-progress-persistence";

type QuestionProgressTableClient = {
  from: (table: string) => any;
};

export async function getQuestionProgress(
  client: QuestionProgressTableClient,
  userId: string,
): Promise<QuestionProgressUpdate[]> {
  const query = client
    .from("question_progress")
    .select("*")
    .eq("user_id", userId)
    .order("question_id", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToQuestionProgressUpdate);
}

export async function saveQuestionProgress(
  client: QuestionProgressTableClient,
  userId: string,
  questionId: string,
  update: QuestionProgressFormUpdate,
): Promise<void> {
  const payload = mapQuestionProgressUpdateToRowInput(userId, questionId, update);
  const { error } = await client
    .from("question_progress")
    .upsert(payload, { onConflict: "user_id,question_id" });

  if (error) {
    throw error;
  }
}
