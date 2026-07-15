type HiddenQuestionsTableClient = { from: (table: string) => any };

export async function getHiddenQuestionIds(
  client: HiddenQuestionsTableClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await client
    .from("hidden_questions")
    .select("question_id")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []).map((row: { question_id: string }) => row.question_id);
}

export async function hideQuestion(
  client: HiddenQuestionsTableClient,
  userId: string,
  questionId: string,
): Promise<void> {
  const { error } = await client
    .from("hidden_questions")
    .upsert({ user_id: userId, question_id: questionId }, { onConflict: "user_id,question_id" });
  if (error) throw error;
}
