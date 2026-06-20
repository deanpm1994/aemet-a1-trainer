import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";

export default function FocusPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Focus"
        title="Structured study block placeholder"
        description="Every future focus session should be objective-driven, timeboxed, and closed with output tracking instead of open-ended reading."
      />
      <PlaceholderPanel
        title="Session contract"
        description="This route will later host the timer, notes, checklist, and review decision."
        bullets={[
          "One objective",
          "One topic or question set",
          "Timebox",
          "Output checklist",
          "Confidence score and next review date",
        ]}
      />
    </div>
  );
}
