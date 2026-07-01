import {
  mapRowToTopicProgressUpdate,
  mapTopicProgressUpdateToRowInput,
  type TopicProgressFormUpdate,
  type TopicProgressUpdate,
} from "./topic-progress-persistence";

type TopicProgressTableClient = {
  from: (table: string) => any;
};

export async function getTopicProgress(
  client: TopicProgressTableClient,
  userId: string,
): Promise<TopicProgressUpdate[]> {
  const query = client
    .from("topic_progress")
    .select("*")
    .eq("user_id", userId)
    .order("topic_id", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToTopicProgressUpdate);
}

export async function saveTopicProgress(
  client: TopicProgressTableClient,
  userId: string,
  topicId: string,
  update: TopicProgressFormUpdate,
): Promise<void> {
  const payload = mapTopicProgressUpdateToRowInput(userId, topicId, update);
  const { error } = await client
    .from("topic_progress")
    .upsert(payload, { onConflict: "user_id,topic_id" });

  if (error) {
    throw error;
  }
}
