import type { Topic } from "./types";

export type TopicProgressRow = {
  user_id: string;
  topic_id: string;
  status: string;
  confidence: number;
  priority: string;
  next_review_at: string;
  notes_status: string;
  created_at: string;
  updated_at: string;
};

export type TopicProgressRowInput = Omit<
  TopicProgressRow,
  "created_at" | "updated_at"
>;

export type TopicProgressUpdate = Pick<
  Topic,
  "status" | "confidence" | "priority" | "nextReviewAt" | "notesStatus"
> & {
  topicId: string;
};

export type TopicProgressFormUpdate = Omit<TopicProgressUpdate, "topicId">;

export function mapRowToTopicProgressUpdate(
  row: TopicProgressRow,
): TopicProgressUpdate {
  return {
    topicId: row.topic_id,
    status: row.status as Topic["status"],
    confidence: row.confidence,
    priority: row.priority as Topic["priority"],
    nextReviewAt: row.next_review_at,
    notesStatus: row.notes_status,
  };
}

export function mapTopicProgressUpdateToRowInput(
  userId: string,
  topicId: string,
  update: TopicProgressFormUpdate,
): TopicProgressRowInput {
  return {
    user_id: userId,
    topic_id: topicId,
    status: update.status,
    confidence: update.confidence,
    priority: update.priority,
    next_review_at: update.nextReviewAt,
    notes_status: update.notesStatus ?? "",
  };
}

export function applyTopicProgress(
  topics: Topic[],
  updates: TopicProgressUpdate[],
): Topic[] {
  const updatesByTopicId = new Map(
    updates.map((update) => [update.topicId, update]),
  );

  return topics.map((topic) => {
    const update = updatesByTopicId.get(topic.id);

    if (!update) {
      return topic;
    }

    return {
      ...topic,
      status: update.status,
      confidence: update.confidence,
      priority: update.priority,
      nextReviewAt: update.nextReviewAt,
      notesStatus: update.notesStatus,
    };
  });
}
