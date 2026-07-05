import "server-only";

import { questions as defaultFallbackQuestions } from "./mock-data";
import {
  createNotionClient,
  NotionConfigError,
} from "./notion-client";
import type {
  AnswerSourceStatus,
  MistakeType,
  Question,
  QuestionType,
  VerificationStatus,
} from "./types";

export type QuestionSourceState = "live" | "fallback_config" | "fallback_error";

export type QuestionSourceResult = {
  questions: Question[];
  sourceState: QuestionSourceState;
  message: string;
};

type MinimalNotionProperty =
  | {
      type: "title";
      title: ReadonlyArray<{ plain_text: string }>;
    }
  | {
      type: "rich_text";
      rich_text: ReadonlyArray<{ plain_text: string }>;
    }
  | {
      type: "number";
      number: number | null;
    }
  | {
      type: "select";
      select: { name: string } | null;
    }
  | {
      type: "status";
      status: { name: string } | null;
    }
  | {
      type: "multi_select";
      multi_select: ReadonlyArray<{ name: string }>;
    }
  | {
      type: "url";
      url: string | null;
    }
  | {
      type: "date";
      date: { start: string } | null;
    };

type MinimalNotionQuestionPage = {
  object: string;
  properties: Record<string, MinimalNotionProperty | undefined>;
};

type QueryResponse = {
  results: unknown[];
};

type NotionQuestionsClient = {
  dataSources: {
    query: (args: { data_source_id: string }) => Promise<QueryResponse>;
  };
};

type LoadQuestionsSourceOptions = {
  env?: Record<string, string | undefined>;
  fallbackQuestions?: Question[];
  createClient?: (config: { token: string; questionsDataSourceId: string }) => NotionQuestionsClient;
};

function isMinimalQuestionPage(value: unknown): value is MinimalNotionQuestionPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MinimalNotionQuestionPage>;

  return candidate.object === "page" && typeof candidate.properties === "object";
}

function getQuestionsConfig(
  env: Record<string, string | undefined>,
): { token: string; questionsDataSourceId: string } {
  const token = env.NOTION_TOKEN?.trim();
  const questionsDataSourceId = env.NOTION_QUESTIONS_DATA_SOURCE_ID?.trim();

  if (!token) {
    throw new NotionConfigError("Missing required Notion env var: NOTION_TOKEN");
  }

  if (!questionsDataSourceId) {
    throw new NotionConfigError(
      "Missing required Notion env var: NOTION_QUESTIONS_DATA_SOURCE_ID",
    );
  }

  return {
    token,
    questionsDataSourceId,
  };
}

function getProperty(
  properties: Record<string, MinimalNotionProperty | undefined>,
  names: string[],
  label: string,
): MinimalNotionProperty {
  for (const name of names) {
    const property = properties[name];

    if (property) {
      return property;
    }
  }

  throw new Error(`Missing required property: ${label}`);
}

function getPlainText(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): string {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "title") {
    return property.title.map((part) => part.plain_text).join("").trim();
  }

  if (property.type === "rich_text") {
    return property.rich_text.map((part) => part.plain_text).join("").trim();
  }

  if (property.type === "select" && property.select?.name) {
    return property.select.name.trim();
  }

  if (property.type === "status" && property.status?.name) {
    return property.status.name.trim();
  }

  if (property.type === "multi_select") {
    const value = property.multi_select
      .map((item) => item.name.trim())
      .filter(Boolean)
      .join(", ");

    if (value) {
      return value;
    }
  }

  throw new Error(`Property ${propertyName} is not text-like`);
}

function getOptionalPlainText(
  property: MinimalNotionProperty | undefined,
): string | undefined {
  if (!property) {
    return undefined;
  }

  if (property.type === "title") {
    const value = property.title.map((part) => part.plain_text).join("").trim();
    return value || undefined;
  }

  if (property.type === "rich_text") {
    const value = property.rich_text.map((part) => part.plain_text).join("").trim();
    return value || undefined;
  }

  if (property.type === "select") {
    return property.select?.name?.trim() || undefined;
  }

  if (property.type === "status") {
    return property.status?.name?.trim() || undefined;
  }

  if (property.type === "multi_select") {
    const value = property.multi_select
      .map((item) => item.name.trim())
      .filter(Boolean)
      .join(", ");

    return value || undefined;
  }

  return undefined;
}

function getNumberValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): number {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "number" && property.number !== null) {
    return property.number;
  }

  const textValue = getOptionalPlainText(property);

  if (!textValue) {
    throw new Error(`Missing required number property: ${propertyName}`);
  }

  const parsed = Number(textValue);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number property: ${propertyName}`);
  }

  return parsed;
}

function getUrlValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): string {
  if (!property || property.type !== "url" || !property.url) {
    throw new Error(`Missing required URL property: ${propertyName}`);
  }

  return property.url;
}

function getDateStart(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): string {
  if (!property || property.type !== "date" || !property.date?.start) {
    throw new Error(`Missing required date property: ${propertyName}`);
  }

  return property.date.start;
}

function parseQuestionType(value: string): QuestionType {
  switch (value.trim()) {
    case "multiple_choice":
    case "practical_case":
    case "formula":
    case "flashcard":
    case "legal_short_answer":
      return value.trim() as QuestionType;
    default:
      throw new Error(`Unsupported question type: ${value}`);
  }
}

function parseVerificationStatus(value: string): VerificationStatus {
  switch (value.trim()) {
    case "verified":
    case "unverified":
    case "needs_review":
    case "deprecated":
      return value.trim() as VerificationStatus;
    default:
      throw new Error(`Unsupported verification status: ${value}`);
  }
}

function parseAnswerSourceStatus(value: string): AnswerSourceStatus {
  switch (value.trim()) {
    case "official":
    case "inferred":
    case "user":
    case "unknown":
      return value.trim() as AnswerSourceStatus;
    default:
      throw new Error(`Unsupported answer source status: ${value}`);
  }
}

function parseDifficulty(value: number): Question["difficulty"] {
  if (value >= 1 && value <= 5) {
    return value as Question["difficulty"];
  }

  throw new Error(`Unsupported difficulty value: ${value}`);
}

function parseCommaSeparated(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMistakeTypes(value: string | undefined): MistakeType[] {
  const parsed = parseCommaSeparated(value);

  if (parsed.length === 0) {
    return ["none"];
  }

  return parsed.map((item) => {
    switch (item) {
      case "concept":
      case "formula":
      case "units":
      case "reading":
      case "legal_wording":
      case "time_management":
      case "none":
        return item;
      default:
        throw new Error(`Unsupported mistake type: ${item}`);
    }
  });
}

export function mapNotionQuestionPage(page: MinimalNotionQuestionPage): Question {
  const id = getPlainText(
    getProperty(page.properties, ["question_id", "Question ID", "Name"], "question_id"),
    "question_id",
  );
  const rawType = getOptionalPlainText(page.properties.type ?? page.properties.Type);

  if (!rawType) {
    throw new Error("Missing usable question type value");
  }

  const options = ["option_a", "option_b", "option_c", "option_d"]
    .map((key) => getOptionalPlainText(page.properties[key]))
    .filter((value): value is string => Boolean(value));

  return {
    id,
    name: id,
    type: parseQuestionType(rawType),
    sourceYear: getNumberValue(
      getProperty(page.properties, ["source_year", "Source Year"], "source_year"),
      "source_year",
    ),
    sourceExam: getPlainText(
      getProperty(page.properties, ["source_exam", "Source Exam"], "source_exam"),
      "source_exam",
    ),
    sourceUrl: getUrlValue(
      getProperty(page.properties, ["source_url", "Source URL"], "source_url"),
      "source_url",
    ),
    retrievedAt: getDateStart(
      getProperty(page.properties, ["retrieved_at", "Retrieved At"], "retrieved_at"),
      "retrieved_at",
    ),
    verificationStatus: parseVerificationStatus(
      getPlainText(
        getProperty(
          page.properties,
          ["verification_status", "Verification Status"],
          "verification_status",
        ),
        "verification_status",
      ),
    ),
    questionNumber: getPlainText(
      getProperty(page.properties, ["question_number", "Question Number"], "question_number"),
      "question_number",
    ),
    statement: getPlainText(
      getProperty(page.properties, ["statement", "Statement"], "statement"),
      "statement",
    ),
    options,
    correctAnswer: getPlainText(
      getProperty(page.properties, ["correct_answer", "Correct Answer"], "correct_answer"),
      "correct_answer",
    ),
    answerSourceStatus: parseAnswerSourceStatus(
      getPlainText(
        getProperty(
          page.properties,
          ["answer_source_status", "Answer Source Status"],
          "answer_source_status",
        ),
        "answer_source_status",
      ),
    ),
    explanation: getPlainText(
      getProperty(page.properties, ["explanation", "Explanation"], "explanation"),
      "explanation",
    ),
    topicIds: parseCommaSeparated(
      getOptionalPlainText(page.properties.topic_ids ?? page.properties["Topics"]),
    ),
    difficulty: parseDifficulty(
      getNumberValue(
        getProperty(page.properties, ["difficulty", "Difficulty"], "difficulty"),
        "difficulty",
      ),
    ),
    attemptsCount: getNumberValue(
      getProperty(page.properties, ["attempts_count", "Attempts Count"], "attempts_count"),
      "attempts_count",
    ),
    lastAttemptAt: getDateStart(
      getProperty(page.properties, ["last_attempt_at", "Last Attempt"], "last_attempt_at"),
      "last_attempt_at",
    ),
    nextReviewAt: getDateStart(
      getProperty(page.properties, ["next_review_at", "Next Review"], "next_review_at"),
      "next_review_at",
    ),
    mistakeTypes: parseMistakeTypes(
      getOptionalPlainText(page.properties.mistake_type ?? page.properties["Mistake Type"]),
    ),
  };
}

function mapQuestionPageSafely(
  page: MinimalNotionQuestionPage,
): Question | null {
  try {
    return mapNotionQuestionPage(page);
  } catch {
    return null;
  }
}

export async function loadQuestionsSource(
  options: LoadQuestionsSourceOptions = {},
): Promise<QuestionSourceResult> {
  const fallbackQuestions = options.fallbackQuestions ?? defaultFallbackQuestions;
  const env = options.env ?? process.env;

  let config: ReturnType<typeof getQuestionsConfig>;

  try {
    config = getQuestionsConfig(env);
  } catch (error) {
    if (error instanceof NotionConfigError) {
      return {
        questions: fallbackQuestions,
        sourceState: "fallback_config",
        message: "La sincronización de Notion no está configurada. Mostrando datos locales.",
      };
    }

    throw error;
  }

  const clientFactory = options.createClient ?? createNotionClient;
  const client = clientFactory(config);

  try {
    const response = await client.dataSources.query({
      data_source_id: config.questionsDataSourceId,
    });

    const mappedQuestions = response.results
      .filter(isMinimalQuestionPage)
      .map((result) => mapQuestionPageSafely(result))
      .filter((question): question is Question => question !== null);

    return {
      questions: mappedQuestions,
      sourceState: "live",
      message: "Sincronización de preguntas con Notion activa.",
    };
  } catch {
    return {
      questions: fallbackQuestions,
      sourceState: "fallback_error",
      message: "Falló la sincronización con Notion. Mostrando datos locales.",
    };
  }
}
