import type { Question, Topic, VerificationStatus } from "./types";

const TODO_VERIFY = "TODO_VERIFY_OFFICIAL_SOURCE";

export type VerificationSummary = {
  total: number;
  verified: number;
  unverified: number;
  needsReview: number;
  deprecated: number;
};

export type ContentReadinessState =
  | "empty"
  | "official_verification_pending"
  | "official_content_ready";

export type ContentReadiness = {
  privateStudyReady: boolean;
  officialContentReady: boolean;
  state: ContentReadinessState;
  topics: VerificationSummary;
  questions: VerificationSummary;
  totalItems: number;
  verifiedItems: number;
  pendingOfficialItems: number;
  title: string;
  detail: string;
};

type VerifiableItem = {
  verificationStatus: VerificationStatus;
};

function countStatus(items: VerifiableItem[], status: VerificationStatus): number {
  return items.filter((item) => item.verificationStatus === status).length;
}

export function summarizeVerification(items: VerifiableItem[]): VerificationSummary {
  return {
    total: items.length,
    verified: countStatus(items, "verified"),
    unverified: countStatus(items, "unverified"),
    needsReview: countStatus(items, "needs_review"),
    deprecated: countStatus(items, "deprecated"),
  };
}

function hasPlaceholder(value: string): boolean {
  return value.trim() === "" || value === TODO_VERIFY;
}

function topicHasOfficialMetadata(topic: Topic): boolean {
  return (
    !hasPlaceholder(topic.officialNumber) &&
    !hasPlaceholder(topic.officialTitle) &&
    !hasPlaceholder(topic.sourceUrl) &&
    !hasPlaceholder(topic.retrievedAt)
  );
}

function questionHasOfficialMetadata(question: Question): boolean {
  return (
    !hasPlaceholder(question.sourceUrl) &&
    !hasPlaceholder(question.retrievedAt) &&
    !hasPlaceholder(question.questionNumber) &&
    !hasPlaceholder(question.statement)
  );
}

function allSourceItemsOfficialReady(topics: Topic[], questions: Question[]): boolean {
  const topicsReady = topics.every(isTopicOfficialReady);
  const questionsReady = questions.every(isQuestionOfficialReady);

  return topicsReady && questionsReady;
}

function isTopicOfficialReady(topic: Topic): boolean {
  return topic.verificationStatus === "verified" && topicHasOfficialMetadata(topic);
}

function isQuestionOfficialReady(question: Question): boolean {
  return question.verificationStatus === "verified" && questionHasOfficialMetadata(question);
}

export function buildContentReadiness(
  topics: Topic[],
  questions: Question[],
): ContentReadiness {
  const topicSummary = summarizeVerification(topics);
  const questionSummary = summarizeVerification(questions);
  const totalItems = topicSummary.total + questionSummary.total;
  const verifiedItems = topicSummary.verified + questionSummary.verified;
  const privateStudyReady = totalItems > 0;
  const officialContentReady =
    privateStudyReady && allSourceItemsOfficialReady(topics, questions);
  const officialReadyItems =
    topics.filter(isTopicOfficialReady).length + questions.filter(isQuestionOfficialReady).length;
  const pendingOfficialItems = totalItems - officialReadyItems;

  if (!privateStudyReady) {
    return {
      privateStudyReady,
      officialContentReady,
      state: "empty",
      topics: topicSummary,
      questions: questionSummary,
      totalItems,
      verifiedItems,
      pendingOfficialItems,
      title: "No study content loaded",
      detail:
        "Add verified official syllabus topics or starter practice items before using the study flow.",
    };
  }

  if (officialContentReady) {
    return {
      privateStudyReady,
      officialContentReady,
      state: "official_content_ready",
      topics: topicSummary,
      questions: questionSummary,
      totalItems,
      verifiedItems,
      pendingOfficialItems,
      title: "Official content ready",
      detail:
        "All loaded topics and questions are verified with source metadata. Continue normal study tracking.",
    };
  }

  return {
    privateStudyReady,
    officialContentReady,
    state: "official_verification_pending",
    topics: topicSummary,
    questions: questionSummary,
    totalItems,
    verifiedItems,
    pendingOfficialItems,
    title: "Ready for private study tracking",
    detail:
      "Use the app for planning, focus sessions, and progress tracking. Official syllabus wording and past-question sources still need verification before being treated as official.",
  };
}
