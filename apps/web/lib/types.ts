export type VerificationStatus =
  | "verified"
  | "unverified"
  | "needs_review"
  | "deprecated";

export type TopicStatus =
  | "not_started"
  | "in_progress"
  | "first_pass"
  | "reviewed"
  | "exam_ready";

export type TopicPriority = "high" | "medium" | "low";

export type Topic = {
  id: string;
  block: string;
  officialNumber: string;
  officialTitle: string;
  normalizedTitle: string;
  status: TopicStatus;
  confidence: number;
  priority: TopicPriority;
  nextReviewAt: string;
  verificationStatus: VerificationStatus;
  sourceUrl: string;
  retrievedAt: string;
  shortDescription?: string;
  studyFocus?: string;
  relatedQuestionCount?: number;
  notesStatus?: string;
};

export type TopicWeakness = {
  id: string;
  label: string;
  confidence: number;
  status: TopicStatus;
  verificationStatus: VerificationStatus;
};

export type TopicBlockSummary = {
  block: string;
  totalTopics: number;
  touchedTopics: number;
  examReadyTopics: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type StudyMission = {
  mainTopic: string;
  practiceBlock: string;
  reviewBlock: string;
  output: string;
};

export type RouteCard = {
  href: string;
  title: string;
  description: string;
};
