import type { Topic, TopicBlockSummary, TopicWeakness } from "./types";

export function countTouchedTopics(topics: Topic[]): number {
  return topics.filter((topic) => topic.status !== "not_started").length;
}

export function countExamReadyTopics(topics: Topic[]): number {
  return topics.filter((topic) => topic.status === "exam_ready").length;
}

export function selectWeakTopics(topics: Topic[]): TopicWeakness[] {
  return topics
    .filter((topic) => topic.status !== "exam_ready")
    .sort((left, right) => left.confidence - right.confidence)
    .slice(0, 3)
    .map((topic) => ({
      id: topic.id,
      label: `${topic.block}: ${topic.normalizedTitle}`,
      confidence: topic.confidence,
      status: topic.status,
      verificationStatus: topic.verificationStatus,
    }));
}

export function buildBlockSummaries(topics: Topic[]): TopicBlockSummary[] {
  const grouped = new Map<string, Topic[]>();

  for (const topic of topics) {
    const existing = grouped.get(topic.block) ?? [];
    existing.push(topic);
    grouped.set(topic.block, existing);
  }

  return [...grouped.entries()]
    .map(([block, blockTopics]) => ({
      block,
      totalTopics: blockTopics.length,
      touchedTopics: countTouchedTopics(blockTopics),
      examReadyTopics: countExamReadyTopics(blockTopics),
    }))
    .sort((left, right) => left.block.localeCompare(right.block));
}
