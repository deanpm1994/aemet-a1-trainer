import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendar"
        title="Planner placeholder around the fixed work schedule"
        description="Calendar integration is deferred. The scaffold only captures the intended study rhythm and future scheduling surface."
      />
      <PlaceholderPanel
        title="Default weekday template"
        description="Future planner logic should prioritize morning blocks and avoid heavy late-night workload."
        bullets={[
          "07:30–09:00 deep technical topic",
          "09:10–10:10 questions or practical case",
          "10:20–11:00 legal, informatics or flashcards",
          "23:30–00:00 optional light review only",
        ]}
      />
    </div>
  );
}
