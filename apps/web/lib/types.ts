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

export type TopicSummary = {
  id: string;
  block: string;
  officialNumber: string;
  shortTitle: string;
  status: TopicStatus;
  confidence: number;
  priority: "high" | "medium" | "low";
  nextReviewAt: string;
  verificationStatus: VerificationStatus;
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
