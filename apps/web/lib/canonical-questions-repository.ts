import type { Question } from "./types";

type QuestionsTableClient = { from: (table: string) => any };

type QuestionRow = {
  id: string; name: string; type: Question["type"]; source_year: number; source_exam: string;
  source_url: string; retrieved_at: string; verification_status: Question["verificationStatus"];
  question_number: string; statement: string; options: string[]; correct_answer: string;
  answer_source_status: Question["answerSourceStatus"]; answer_source_url: string | null;
  answer_retrieved_at: string | null; explanation: string; topic_ids: string[]; difficulty: Question["difficulty"];
  origin?: Question["origin"]; editorial_status?: Question["editorialStatus"];
};

export function mapCanonicalQuestionRow(row: QuestionRow): Question {
  return { id: row.id, name: row.name, type: row.type, sourceYear: row.source_year, sourceExam: row.source_exam, sourceUrl: row.source_url, retrievedAt: row.retrieved_at, verificationStatus: row.verification_status, questionNumber: row.question_number, statement: row.statement, options: row.options, correctAnswer: row.correct_answer, answerSourceStatus: row.answer_source_status, answerSourceUrl: row.answer_source_url ?? undefined, answerRetrievedAt: row.answer_retrieved_at ?? undefined, origin: row.origin ?? "official_historic", editorialStatus: row.editorial_status ?? "official", explanation: row.explanation, topicIds: row.topic_ids, difficulty: row.difficulty, attemptsCount: 0, lastAttemptAt: "", nextReviewAt: "", mistakeTypes: ["none"] };
}

export async function getVerifiedCanonicalQuestions(client: QuestionsTableClient): Promise<Question[]> {
  const { data, error } = await client.from("questions").select("*").in("origin", ["official_historic", "didactic_reviewed"]).order("source_year", { ascending: false }).order("question_number", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCanonicalQuestionRow);
}
