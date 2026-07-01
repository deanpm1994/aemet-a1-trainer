# PWA Reminder Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add basic PWA installability metadata and keep reminder preferences documented as saved settings only.

**Architecture:** Use Next.js App Router metadata and `MetadataRoute.Manifest` for a static manifest. Store project-owned SVG icons in `apps/web/public`, and update docs to distinguish installability from inactive notification delivery.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Tailwind CSS, static SVG assets.

---

## File Structure

- Create `apps/web/app/manifest.test.ts`: Vitest coverage for manifest metadata and non-claims.
- Create `apps/web/app/manifest.ts`: typed Next.js manifest route.
- Create `apps/web/public/icon.svg`: project-owned app icon used for standard and maskable manifest icon entries.
- Create `apps/web/public/apple-icon.svg`: project-owned Apple touch icon.
- Modify `apps/web/app/layout.tsx`: add manifest, icon, Apple web app, and theme metadata.
- Modify `apps/web/components/settings-form.tsx`: tighten reminder copy to say preferences are saved for a future notification phase.
- Modify `docs/PROJECT_MEMORY.md`: record Phase 7 installability status and inactive notification delivery.
- Modify `docs/ROADMAP.md`: mark installability shell progress without marking notifications complete.

## Tasks

### Task 1: Add failing manifest tests

**Files:**
- Create: `apps/web/app/manifest.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";

import manifest from "./manifest";

describe("web app manifest", () => {
  it("describes the installable AEMET A1 Trainer app", () => {
    const result = manifest();

    expect(result.name).toBe("AEMET A1 Trainer");
    expect(result.short_name).toBe("AEMET A1");
    expect(result.start_url).toBe("/");
    expect(result.scope).toBe("/");
    expect(result.display).toBe("standalone");
    expect(result.lang).toBe("en");
    expect(result.categories).toContain("education");
  });

  it("uses project-owned icons for normal and maskable install surfaces", () => {
    const result = manifest();

    expect(result.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "any",
        }),
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "maskable",
        }),
      ]),
    );
  });

  it("does not claim active reminders, active monitoring, or official status", () => {
    const result = manifest();
    const searchable = [
      result.name,
      result.short_name,
      result.description,
      ...(result.screenshots ?? []).map((screenshot) => screenshot.label ?? ""),
    ]
      .join(" ")
      .toLowerCase();

    expect(searchable).not.toContain("official");
    expect(searchable).not.toContain("active reminder");
    expect(searchable).not.toContain("push notification");
    expect(searchable).not.toContain("active monitoring");
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm --prefix apps/web test -- apps/web/app/manifest.test.ts`

Expected: FAIL because `apps/web/app/manifest.ts` does not exist.

- [ ] **Step 3: Commit only if stopping after this task**

No commit is required after the red test if continuing immediately to Task 2.

### Task 2: Implement the manifest and app icons

**Files:**
- Create: `apps/web/app/manifest.ts`
- Create: `apps/web/public/icon.svg`
- Create: `apps/web/public/apple-icon.svg`
- Test: `apps/web/app/manifest.test.ts`

- [ ] **Step 1: Add the manifest route**

Create `apps/web/app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";

const themeColor = "#1f5f70";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AEMET A1 Trainer",
    short_name: "AEMET A1",
    description:
      "Study planner, topic checklist, question practice, and focus support for AEMET A1 preparation.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: themeColor,
    lang: "en",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
```

- [ ] **Step 2: Add the standard app icon**

Create `apps/web/public/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title desc">
  <title id="title">AEMET A1 Trainer app icon</title>
  <desc id="desc">Project-owned icon with a study card, horizon line, and weather preparation mark.</desc>
  <rect width="512" height="512" rx="96" fill="#f7f4ee"/>
  <path d="M96 330c48-58 93-87 136-87 37 0 66 21 92 64 18-15 38-23 61-23 31 0 59 16 83 48v84H96v-86Z" fill="#1f5f70"/>
  <path d="M111 168c0-31 25-56 56-56h178c31 0 56 25 56 56v182c0 31-25 56-56 56H167c-31 0-56-25-56-56V168Z" fill="#ffffff"/>
  <path d="M151 181h210M151 237h210M151 293h132" stroke="#1f5f70" stroke-width="24" stroke-linecap="round"/>
  <circle cx="352" cy="156" r="45" fill="#e2a53a"/>
  <path d="M331 360h82" stroke="#e2a53a" stroke-width="24" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Add the Apple touch icon**

Create `apps/web/public/apple-icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-labelledby="title desc">
  <title id="title">AEMET A1 Trainer Apple icon</title>
  <desc id="desc">Project-owned compact study and weather preparation icon.</desc>
  <rect width="180" height="180" rx="40" fill="#1f5f70"/>
  <rect x="42" y="42" width="96" height="108" rx="18" fill="#ffffff"/>
  <path d="M59 70h62M59 93h62M59 116h38" stroke="#1f5f70" stroke-width="9" stroke-linecap="round"/>
  <circle cx="130" cy="47" r="20" fill="#e2a53a"/>
</svg>
```

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm --prefix apps/web test -- apps/web/app/manifest.test.ts`

Expected: PASS for all manifest tests.

### Task 3: Wire metadata and reminder shell copy

**Files:**
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/components/settings-form.tsx`

- [ ] **Step 1: Update root metadata**

Change `apps/web/app/layout.tsx` metadata to:

```ts
export const metadata: Metadata = {
  title: {
    default: "AEMET A1 Trainer",
    template: "%s | AEMET A1 Trainer",
  },
  description:
    "Study planner, topic checklist, question practice, and focus support for AEMET A1 preparation.",
  manifest: "/manifest.webmanifest",
  applicationName: "AEMET A1 Trainer",
  appleWebApp: {
    capable: true,
    title: "AEMET A1",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  themeColor: "#1f5f70",
};
```

- [ ] **Step 2: Keep reminder settings copy explicit**

In `apps/web/components/settings-form.tsx`, change the reminder paragraph to:

```tsx
<p className="text-sm leading-6 text-ink/70">
  Preferences save for a future notification phase. Browser notifications are not active yet.
</p>
```

- [ ] **Step 3: Run focused tests**

Run: `npm --prefix apps/web test -- apps/web/app/manifest.test.ts`

Expected: PASS.

### Task 4: Update docs

**Files:**
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Update project memory**

In `docs/PROJECT_MEMORY.md`, add these Phase 7 bullets under the current implementation handoff:

```md
Phase 7 status:
- Basic PWA installability metadata and project-owned icon placeholders implemented
- Reminder preferences remain saved settings only
- No browser notifications, push subscriptions, service worker, offline cache, or scheduled reminder delivery are active
```

- [ ] **Step 2: Update roadmap**

In `docs/ROADMAP.md`, update Phase 7 to:

```md
## Phase 7 — PWA and reminders

- Add PWA manifest (complete)
- Add installable mobile view metadata (complete)
- Add reminder settings shell (complete; delivery inactive)
- Add notifications
- Add countdown widgets
- Add offline review mode
```

### Task 5: Verify and commit

**Files:**
- Verify all changed files.

- [ ] **Step 1: Run the full test suite**

Run: `npm --prefix apps/web test`

Expected: PASS.

- [ ] **Step 2: Run lint and type checks**

Run: `npm --prefix apps/web run lint`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm --prefix apps/web run build`

Expected: PASS.

- [ ] **Step 4: Confirm manifest route exists in build output**

Run: `find apps/web/.next/server/app -maxdepth 2 -name '*manifest*' -print`

Expected: includes a generated manifest route artifact.

- [ ] **Step 5: Review git diff**

Run: `git diff --stat`

Expected: changes are limited to manifest tests, manifest route, icons, metadata, settings copy, and docs.

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/manifest.test.ts apps/web/app/manifest.ts apps/web/public/icon.svg apps/web/public/apple-icon.svg apps/web/app/layout.tsx apps/web/components/settings-form.tsx docs/PROJECT_MEMORY.md docs/ROADMAP.md
git commit -m "feat(pwa): add installable reminder shell"
```
