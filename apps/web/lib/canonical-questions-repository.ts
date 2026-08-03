import type {
  AnswerSupport,
  Question,
  QuestionContentFormat,
  QuestionSourceAsset,
} from "./types";

type QuestionsTableClient = { from: (table: string) => any; storage?: { from: (bucket: string) => { createSignedUrl: (path: string, expiresIn: number) => Promise<{ data: { signedUrl: string } | null; error: unknown }> } } };

type QuestionRow = {
  id: string; name: string; type: Question["type"]; source_year: number; source_exam: string;
  source_url: string; retrieved_at: string; verification_status: Question["verificationStatus"];
  question_number: string; statement: string; options: string[]; correct_answer: string;
  answer_source_status: Question["answerSourceStatus"]; answer_source_url: string | null;
  answer_retrieved_at: string | null; explanation: string; topic_ids: string[]; difficulty: Question["difficulty"];
  origin?: Question["origin"]; editorial_status?: Question["editorialStatus"];
  selection_instruction?: Question["selectionInstruction"];
  raw_statement?: string | null; raw_options?: string[] | null;
  content_format?: QuestionContentFormat | null; reviewed_at?: string | null;
  oep_year?: number | null; exam_date?: string | null; exam_part?: Question["examPart"] | null;
  question_role?: Question["questionRole"] | null;
  reserve_disposition?: Question["reserveDisposition"] | null;
  disposition?: Question["disposition"] | null; case_group?: Question["caseGroup"] | null;
  model_answer?: string | null; answer_format?: Question["answerFormat"] | null;
  grading_rubric?: string | null;
};

type QuestionSourceAssetRow = {
  id: string;
  question_id: string;
  asset_type: QuestionSourceAsset["assetType"];
  source_label: string;
  official_pdf_url: string;
  official_pdf_page: number;
  crop_box: QuestionSourceAsset["cropBox"];
  storage_bucket: string;
  storage_path: string;
  verification_status: QuestionSourceAsset["verificationStatus"];
  retrieved_at: string;
  placement?: QuestionSourceAsset["placement"] | null;
  option_key?: string | null;
  alt_text?: string | null;
};

export function mapCanonicalQuestionRow(row: QuestionRow): Question {
  return {
    id: row.id, name: row.name, type: row.type, sourceYear: row.source_year,
    oepYear: row.oep_year ?? undefined, examDate: row.exam_date ?? undefined,
    examPart: row.exam_part ?? undefined, sourceExam: row.source_exam,
    sourceUrl: row.source_url, retrievedAt: row.retrieved_at,
    verificationStatus: row.verification_status, questionNumber: row.question_number,
    statement: row.statement, options: row.options,
    rawStatement: row.raw_statement ?? undefined, rawOptions: row.raw_options ?? undefined,
    contentFormat: row.content_format ?? "plain_text", reviewedAt: row.reviewed_at ?? undefined,
    correctAnswer: row.correct_answer, answerSourceStatus: row.answer_source_status,
    answerSourceUrl: row.answer_source_url ?? undefined,
    answerRetrievedAt: row.answer_retrieved_at ?? undefined,
    origin: row.origin ?? "official_historic", editorialStatus: row.editorial_status ?? "official",
    selectionInstruction: row.selection_instruction ?? "as_written",
    explanation: row.explanation, questionRole: row.question_role ?? "ordinary",
    reserveDisposition: row.reserve_disposition ?? "not_applicable",
    disposition: row.disposition ?? "available", caseGroup: row.case_group ?? undefined,
    modelAnswer: row.model_answer ?? undefined,
    answerFormat: row.answer_format ?? (row.type === "practical_case" ? "developed_response" : "single_choice"),
    gradingRubric: row.grading_rubric ?? undefined, topicIds: row.topic_ids,
    difficulty: row.difficulty, attemptsCount: 0, lastAttemptAt: "",
    nextReviewAt: "", mistakeTypes: ["none"],
  };
}

async function loadQuestionSourceAssets(client: QuestionsTableClient, questionIds: string[]): Promise<Map<string, QuestionSourceAsset[]>> {
  if (questionIds.length === 0) return new Map();

  try {
    const { data, error } = await client.from("question_source_assets").select("*").in("question_id", questionIds);
    if (error) return new Map();
    const rows = (data ?? []) as QuestionSourceAssetRow[];
    const assets = await Promise.all(rows.map(async (row) => {
      let signedUrl: string | undefined;
      if (client.storage) {
        const result = await client.storage.from(row.storage_bucket).createSignedUrl(row.storage_path, 60 * 60);
        signedUrl = result.data?.signedUrl;
      }
      const asset: QuestionSourceAsset = {
        id: row.id,
        assetType: row.asset_type,
        sourceLabel: row.source_label,
        officialPdfUrl: row.official_pdf_url,
        officialPdfPage: row.official_pdf_page,
        cropBox: row.crop_box,
        verificationStatus: row.verification_status,
        retrievedAt: row.retrieved_at,
        placement: row.placement ?? "statement",
        optionKey: row.option_key ?? undefined,
        altText: row.alt_text ?? `Recorte oficial de la pregunta ${row.question_id}.`,
        signedUrl,
      };
      return [row.question_id, asset] as const;
    }));
    return assets.reduce((byQuestion, [questionId, asset]) => {
      byQuestion.set(questionId, [...(byQuestion.get(questionId) ?? []), asset]);
      return byQuestion;
    }, new Map<string, QuestionSourceAsset[]>());
  } catch {
    // The bank remains available while the source-asset migration is being deployed.
    return new Map();
  }
}

type AnswerSupportRow = {
  id: string;
  question_id: string;
  label: string;
  source_url: string;
  retrieved_at: string;
  verification_status: AnswerSupport["verificationStatus"];
  placement: AnswerSupport["placement"];
  option_key: string | null;
  content_hash: string | null;
};

async function loadAnswerSupports(
  client: QuestionsTableClient,
  questionIds: string[],
): Promise<Map<string, AnswerSupport[]>> {
  if (questionIds.length === 0) return new Map();
  try {
    const { data, error } = await client.from("question_answer_supports")
      .select("*").in("question_id", questionIds);
    if (error) return new Map();
    return ((data ?? []) as AnswerSupportRow[]).reduce((byQuestion, row) => {
      const support: AnswerSupport = {
        id: row.id,
        label: row.label,
        url: row.source_url,
        retrievedAt: row.retrieved_at,
        verificationStatus: row.verification_status,
        placement: row.placement,
        optionKey: row.option_key ?? undefined,
        contentHash: row.content_hash ?? undefined,
      };
      byQuestion.set(row.question_id, [...(byQuestion.get(row.question_id) ?? []), support]);
      return byQuestion;
    }, new Map<string, AnswerSupport[]>());
  } catch {
    return new Map();
  }
}

export async function getCanonicalQuestions(client: QuestionsTableClient): Promise<Question[]> {
  const { data, error } = await client.from("questions").select("*").order("source_year", { ascending: false }).order("question_number", { ascending: true });
  if (error) throw error;
  const questions: Question[] = (data ?? []).map((row: QuestionRow) => mapCanonicalQuestionRow(row));
  const eligibleIds = questions
    .filter((question) => question.verificationStatus === "verified" && question.disposition === "available")
    .map((question) => question.id);
  const assetsByQuestion = await loadQuestionSourceAssets(client, eligibleIds);
  const supportsByQuestion = await loadAnswerSupports(client, eligibleIds);
  questions.forEach((question) => {
    question.sourceAssets = assetsByQuestion.get(question.id) ?? [];
    question.answerSupports = supportsByQuestion.get(question.id) ?? [];
  });
  return questions;
}

export async function getVerifiedCanonicalQuestions(client: QuestionsTableClient): Promise<Question[]> {
  const questions = await getCanonicalQuestions(client);
  return questions.filter((question) =>
    question.verificationStatus === "verified" &&
    question.disposition === "available" &&
    (question.origin === "official_historic" || question.editorialStatus === "reviewed"),
  );
}
