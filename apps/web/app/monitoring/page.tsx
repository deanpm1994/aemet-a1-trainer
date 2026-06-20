import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";

export default function MonitoringPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Monitoring"
        title="Official-source monitoring placeholder"
        description="No BOE or AEMET scraping, polling, or alerting is implemented yet. This page states that clearly."
      />
      <PlaceholderPanel
        title="Current status"
        description="The monitoring module is intentionally non-operational until official sources, snapshot logic, and verification rules are coded and tested."
        bullets={[
          "State: manual only",
          "Do not claim active alerts",
          "Store official source URL and retrieval metadata before surfacing changes",
        ]}
      />
    </div>
  );
}
