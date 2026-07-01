import type { QuestionProgressUpdate } from "./question-progress-persistence";
import type { TopicProgressUpdate } from "./topic-progress-persistence";
import type { MistakeType, Question, StudySession, Topic, TopicStatus } from "./types";

type FocusProgressInput = {
  topics: Topic[];
  questions: Question[];
  topicProgress: TopicProgressUpdate[];
  questionProgress: QuestionProgressUpdate[];
};

type FocusProgressUpdates = {
  topicUpdates: TopicProgressUpdate[];
  questionUpdates: QuestionProgressUpdate[];
};

export function buildFocusProgressUpdates(
  session: StudySession,
  input: FocusProgressInput,
): FocusProgressUpdates {
  if (!session.completed || session.status !== "completed") {
    return {
      topicUpdates: [],
      questionUpdates: [],
    };
  }

  return {
    topicUpdates: buildTopicUpdates(session, input),
    questionUpdates: buildQuestionUpdates(session, input),
  };
}

function buildTopicUpdates(
  session: StudySession,
  input: FocusProgressInput,
): TopicProgressUpdate[] {
  return session.topicIds.flatMap((topicId) => {
    const sourceTopic = input.topics.find((topic) => topic.id === topicId);
    const existingProgress = input.topicProgress.find(
      (progress) => progress.topicId === topicId,
    );

    if (!sourceTopic && !existingProgress) {
      return [];
    }

    const currentStatus = existingProgress?.status ?? sourceTopic?.status ?? "in_progress";
    const confidence = session.confidenceAfter ?? existingProgress?.confidence ?? 3;

    return [
      {
        topicId,
        status: advanceTopicStatus(currentStatus, confidence),
        confidence,
        priority: existingProgress?.priority ?? sourceTopic?.priority ?? "medium",
        nextReviewAt: session.nextReviewAt,
        notesStatus: session.notesCreated
          ? "Session notes created"
          : existingProgress?.notesStatus ?? sourceTopic?.notesStatus ?? "",
      },
    ];
  });
}

function buildQuestionUpdates(
  session: StudySession,
  input: FocusProgressInput,
): QuestionProgressUpdate[] {
  return session.questionIds.flatMap((questionId) => {
    const sourceQuestion = input.questions.find((question) => question.id === questionId);
    const existingProgress = input.questionProgress.find(
      (progress) => progress.questionId === questionId,
    );

    if (!sourceQuestion && !existingProgress) {
      return [];
    }

    const mistakeTypes = buildMistakeTypes(
      existingProgress?.mistakeTypes ?? sourceQuestion?.mistakeTypes ?? ["none"],
      session.mistakesLogged,
    );

    return [
      {
        questionId,
        attemptsCount:
          (existingProgress?.attemptsCount ?? sourceQuestion?.attemptsCount ?? 0) + 1,
        lastAttemptAt: session.plannedDate,
        nextReviewAt: session.nextReviewAt,
        mistakeTypes,
      },
    ];
  });
}

function advanceTopicStatus(
  currentStatus: TopicStatus,
  confidence: number,
): TopicStatus {
  if (currentStatus === "exam_ready") {
    return "exam_ready";
  }

  if (confidence >= 4) {
    return "reviewed";
  }

  if (confidence >= 3) {
    return "first_pass";
  }

  return "in_progress";
}

function buildMistakeTypes(
  currentMistakeTypes: MistakeType[],
  mistakesLogged: number,
): MistakeType[] {
  if (mistakesLogged <= 0) {
    return ["none"];
  }

  const mistakeTypes = currentMistakeTypes.filter(
    (mistakeType) => mistakeType !== "none",
  );

  if (!mistakeTypes.includes("time_management")) {
    mistakeTypes.push("time_management");
  }

  return mistakeTypes;
}
