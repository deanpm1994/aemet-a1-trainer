import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";

export default function QuestionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Questions"
        title="Question bank placeholder"
        description="Route reserved for multiple-choice questions, practical cases, formulas, flashcards, and legal short answers."
      />
      <PlaceholderPanel
        title="Planned MVP shape"
        description="No real questions are stored yet. This route exists so navigation and app structure are stable from the start."
        bullets={[
          "Manual question entry before import automation.",
          "Source URL, retrieval date, and verification status for official material.",
          "Attempt tracking, difficulty, mistake type, and next review date.",
        ]}
      />
    </div>
  );
}
