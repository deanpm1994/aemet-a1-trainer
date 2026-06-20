import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Future configuration placeholder"
        description="Reserved for account, verification rules, study preferences, reminders, and later integrations such as Supabase Auth, Notion, and Google Calendar."
      />
      <PlaceholderPanel
        title="Planned settings areas"
        description="This page is stable enough to wire navigation now without pretending any integration already exists."
        bullets={[
          "Study schedule defaults",
          "Notification and reminder preferences",
          "Verification policy and source metadata",
          "Future auth and sync integrations",
        ]}
      />
    </div>
  );
}
