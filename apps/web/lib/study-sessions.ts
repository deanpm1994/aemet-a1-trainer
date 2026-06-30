import type {
  ReviewState,
  SessionType,
  StudySession,
  StudySessionStatus,
  TimerStatus,
} from "./types";

export type StudySessionRow = {
  id: string;
  user_id: string;
  name: string;
  session_type: string;
  objective: string;
  topic_ids: string[];
  question_ids: string[];
  planned_date: string;
  planned_start_time: string;
  planned_end_time: string;
  planned_duration_minutes: number;
  status: string;
  timer_status: string;
  completed: boolean;
  review_state: string;
  notes_created: boolean;
  questions_solved: number;
  flashcards_created: number;
  mistakes_logged: number;
  confidence_after: number | null;
  next_review_at: string | null;
  notes: string;
  is_template: boolean;
  created_at: string;
  updated_at: string;
};

export type StudySessionRowInput = Omit<
  StudySessionRow,
  "created_at" | "updated_at"
>;

export function mapRowToStudySession(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    name: row.name,
    sessionType: row.session_type as SessionType,
    objective: row.objective,
    topicIds: row.topic_ids,
    questionIds: row.question_ids,
    plannedDate: row.planned_date,
    plannedStartTime: row.planned_start_time,
    plannedEndTime: row.planned_end_time,
    plannedDurationMinutes: row.planned_duration_minutes,
    status: row.status as StudySessionStatus,
    timerStatus: row.timer_status as TimerStatus,
    completed: row.completed,
    reviewState: row.review_state as ReviewState,
    notesCreated: row.notes_created,
    questionsSolved: row.questions_solved,
    flashcardsCreated: row.flashcards_created,
    mistakesLogged: row.mistakes_logged,
    confidenceAfter: row.confidence_after,
    nextReviewAt: row.next_review_at ?? "",
    notes: row.notes,
    isTemplate: row.is_template,
    isPersisted: true,
  };
}

export function mapStudySessionToRowInput(
  userId: string,
  session: StudySession,
): StudySessionRowInput {
  return {
    id: session.id,
    user_id: userId,
    name: session.name,
    session_type: session.sessionType,
    objective: session.objective,
    topic_ids: session.topicIds,
    question_ids: session.questionIds,
    planned_date: session.plannedDate,
    planned_start_time: session.plannedStartTime,
    planned_end_time: session.plannedEndTime,
    planned_duration_minutes: session.plannedDurationMinutes,
    status: session.status,
    timer_status: session.timerStatus,
    completed: session.completed,
    review_state: session.reviewState,
    notes_created: session.notesCreated,
    questions_solved: session.questionsSolved,
    flashcards_created: session.flashcardsCreated,
    mistakes_logged: session.mistakesLogged,
    confidence_after: session.confidenceAfter,
    next_review_at: session.nextReviewAt || null,
    notes: session.notes,
    is_template: session.isTemplate,
  };
}

export function mapRecommendedSessionsToRowInputs(
  userId: string,
  sessions: StudySession[],
): StudySessionRowInput[] {
  return sessions.map((session) =>
    mapStudySessionToRowInput(userId, {
      ...session,
      isTemplate: false,
    }),
  );
}
