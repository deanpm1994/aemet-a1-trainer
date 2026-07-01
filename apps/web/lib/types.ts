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

export type QuestionType =
  | "multiple_choice"
  | "practical_case"
  | "formula"
  | "flashcard"
  | "legal_short_answer";

export type AnswerSourceStatus = "official" | "inferred" | "user" | "unknown";

export type MistakeType =
  | "concept"
  | "formula"
  | "units"
  | "reading"
  | "legal_wording"
  | "time_management"
  | "none";

export type Question = {
  id: string;
  name: string;
  type: QuestionType;
  sourceYear: number;
  sourceExam: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  explanation: string;
  topicIds: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  attemptsCount: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  mistakeTypes: MistakeType[];
};

export type QuestionFilters = {
  type: QuestionType | "all";
  verificationStatus: VerificationStatus | "all";
  difficulty: Question["difficulty"] | "all";
  mistakeType: MistakeType | "all";
};

export type ResourcePriority = "core" | "useful" | "optional";

export type ResourceSourceType =
  | "aemet_recommended"
  | "official"
  | "complementary";

export type BibliographyItem = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  blocks: string[];
  category: string;
  priority: ResourcePriority;
  sourceType: ResourceSourceType;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  notes: string;
};

export type SessionType =
  | "deep_topic"
  | "questions"
  | "practical_case"
  | "legal"
  | "informatics"
  | "flashcards"
  | "review";

export type StudySessionStatus =
  | "scheduled"
  | "in_progress"
  | "ready_for_review"
  | "completed"
  | "extended"
  | "abandoned";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export type ReviewState = "not_needed" | "waiting" | "done";

export type StudySession = {
  id: string;
  name: string;
  sessionType: SessionType;
  objective: string;
  topicIds: string[];
  questionIds: string[];
  plannedDate: string;
  plannedStartTime: string;
  plannedEndTime: string;
  plannedDurationMinutes: number;
  status: StudySessionStatus;
  timerStatus: TimerStatus;
  completed: boolean;
  reviewState: ReviewState;
  notesCreated: boolean;
  questionsSolved: number;
  flashcardsCreated: number;
  mistakesLogged: number;
  confidenceAfter: number | null;
  nextReviewAt: string;
  notes: string;
  isTemplate: boolean;
  isPersisted: boolean;
};

export type PlannerDay = {
  date: string;
  label: string;
  sessions: StudySession[];
};

export type PlannerWeekSummary = {
  totalSessions: number;
  completedSessions: number;
  readyForReviewSessions: number;
  totalPlannedMinutes: number;
  completedMinutes: number;
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

export type ReminderChannel = "in_app";

export type UserSettings = {
  profile: {
    displayName: string;
    timezone: string;
  };
  studyPreferences: {
    studyStartTime: string;
    deepWorkMinutes: number;
    practiceMinutes: number;
    reviewMinutes: number;
    workdayStartTime: string;
    workdayEndTime: string;
  };
  reminderPreferences: {
    remindersEnabled: boolean;
    reminderChannel: ReminderChannel;
    morningReminderTime: string | null;
    eveningReminderTime: string | null;
  };
};

export type MonitoringSourceType =
  | "boe"
  | "aemet"
  | "inap"
  | "government"
  | "institutional";

export type MonitoringCheckFrequency = "manual" | "daily" | "weekly";

export type MonitoringSourceStatus =
  | "manual_only"
  | "configured"
  | "active"
  | "paused"
  | "error";

export type MonitoringEventType =
  | "possible_oep"
  | "convocatoria_detected"
  | "application_deadline_detected"
  | "admitidos_list_detected"
  | "exam_date_detected"
  | "answer_template_detected"
  | "results_detected"
  | "bibliography_update"
  | "past_exam_update"
  | "generic_change";

export type MonitoringSource = {
  id: string;
  name: string;
  url: string;
  sourceType: MonitoringSourceType;
  keywords: string[];
  checkFrequency: MonitoringCheckFrequency;
  lastCheckedAt: string;
  lastChangeAt: string;
  status: MonitoringSourceStatus;
  notes: string;
  verificationStatus: VerificationStatus;
};

export type MonitoringEvent = {
  id: string;
  sourceId: string;
  detectedAt: string;
  eventType: MonitoringEventType;
  title: string;
  url: string;
  summary: string;
  confidence: 1 | 2 | 3 | 4 | 5;
  requiresReview: boolean;
  resolved: boolean;
  verificationStatus: VerificationStatus;
};

export type MonitoringSummary = {
  totalSources: number;
  configuredSources: number;
  activeSources: number;
  totalEvents: number;
  pendingReviewEvents: number;
  resolvedEvents: number;
};
