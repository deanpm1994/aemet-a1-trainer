import {
  mapQuestionAttemptInputToRowInput,
  mapRowToQuestionAttempt,
  type QuestionAttempt,
  type QuestionAttemptInput,
} from "./question-attempts";

type QuestionAttemptTableClient = {
  from: (table: string) => any;
};

export async function getQuestionAttempts(
  client: QuestionAttemptTableClient,
  userId: string,
  questionId: string,
): Promise<QuestionAttempt[]> {
  const query = client
    .from("question_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .order("attempted_at", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToQuestionAttempt);
}

export async function saveQuestionAttempt(
  client: QuestionAttemptTableClient,
  userId: string,
  input: QuestionAttemptInput,
): Promise<void> {
  const { error } = await client
    .from("question_attempts")
    .insert(mapQuestionAttemptInputToRowInput(userId, input));

  if (error) {
    throw error;
  }
}
