"use client";

import { useState, useTransition } from "react";

import type { Topic, TopicPriority, TopicStatus } from "@/lib/types";

type TopicProgressActionResult = {
  ok: boolean;
  message: string;
};

type TopicProgressFormProps = {
  topic: Topic;
  canPersist: boolean;
  statusMessage: string;
  onSave: (formData: FormData) => Promise<TopicProgressActionResult>;
};

const topicStatuses: Array<{ value: TopicStatus; label: string }> = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "first_pass", label: "First pass" },
  { value: "reviewed", label: "Reviewed" },
  { value: "exam_ready", label: "Exam ready" },
];

const priorities: Array<{ value: TopicPriority; label: string }> = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function TopicProgressForm({
  topic,
  canPersist,
  statusMessage,
  onSave,
}: TopicProgressFormProps) {
  const [message, setMessage] = useState(statusMessage);
  const [isPending, startTransition] = useTransition();

  function submitProgress(formData: FormData) {
    if (!canPersist) {
      setMessage("Sign in to persist topic progress changes.");
      return;
    }

    startTransition(async () => {
      const result = await onSave(formData);
      setMessage(result.message);
    });
  }

  return (
    <form action={submitProgress} className="mt-4 grid gap-4 text-sm text-ink/80">
      <label className="grid gap-1">
        <span className="text-ink/50">Status</span>
        <select
          className="rounded-xl border border-ink/10 bg-white px-3 py-2"
          defaultValue={topic.status}
          name="status"
        >
          {topicStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-ink/50">Confidence</span>
        <input
          className="rounded-xl border border-ink/10 bg-white px-3 py-2"
          defaultValue={topic.confidence}
          max={5}
          min={1}
          name="confidence"
          type="number"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-ink/50">Priority</span>
        <select
          className="rounded-xl border border-ink/10 bg-white px-3 py-2"
          defaultValue={topic.priority}
          name="priority"
        >
          {priorities.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1">
        <span className="text-ink/50">Next review</span>
        <input
          className="rounded-xl border border-ink/10 bg-white px-3 py-2"
          defaultValue={topic.nextReviewAt}
          name="nextReviewAt"
          type="text"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-ink/50">Notes status</span>
        <input
          className="rounded-xl border border-ink/10 bg-white px-3 py-2"
          defaultValue={topic.notesStatus ?? ""}
          name="notesStatus"
          type="text"
        />
      </label>

      <p className="text-sm text-ink/60">{message}</p>

      <button
        className="w-fit rounded-full bg-ink px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || !canPersist}
        type="submit"
      >
        Save study state
      </button>
    </form>
  );
}
