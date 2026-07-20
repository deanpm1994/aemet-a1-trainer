import { describe, expect, it } from "vitest";

import { buildContentReadiness, summarizeVerification } from "./content-readiness";
import { questions, topics } from "./mock-data";
import type { Question, Topic } from "./types";

const verifiedTopic: Topic = {
  ...topics[0],
  id: "verified-topic",
  verificationStatus: "verified",
  officialNumber: "1",
  officialTitle: "Verified official topic wording",
  sourceUrl: "https://www.boe.es/example",
  retrievedAt: "2026-07-01",
};

const verifiedQuestion: Question = {
  ...questions[0],
  id: "verified-question",
  verificationStatus: "verified",
  sourceUrl: "https://www.aemet.es/example",
  retrievedAt: "2026-07-01",
  answerSourceStatus: "official",
};

describe("verification summaries", () => {
  it("counts source items by verification status", () => {
    expect(
      summarizeVerification([
        { verificationStatus: "verified" },
        { verificationStatus: "unverified" },
        { verificationStatus: "needs_review" },
        { verificationStatus: "deprecated" },
      ]),
    ).toEqual({
      total: 4,
      verified: 1,
      unverified: 1,
      needsReview: 1,
      deprecated: 1,
    });
  });
});

describe("content readiness", () => {
  it("marks local starter fixtures as private-study ready but not official-ready", () => {
    expect(buildContentReadiness(topics, questions)).toMatchObject({
      privateStudyReady: true,
      officialContentReady: false,
      state: "official_verification_pending",
    });
  });

  it("keeps official readiness pending when verified and unverified content are mixed", () => {
    expect(buildContentReadiness([verifiedTopic, topics[0]], [verifiedQuestion])).toMatchObject({
      privateStudyReady: true,
      officialContentReady: false,
      state: "official_verification_pending",
      pendingOfficialItems: 1,
    });
  });

  it("marks official content ready only when every topic and question is verified", () => {
    expect(buildContentReadiness([verifiedTopic], [verifiedQuestion])).toMatchObject({
      privateStudyReady: true,
      officialContentReady: true,
      state: "official_content_ready",
    });
  });

  it("counts a verified but quarantined question as pending", () => {
    expect(buildContentReadiness([verifiedTopic], [{
      ...verifiedQuestion,
      disposition: "quarantined",
    }])).toMatchObject({
      officialContentReady: false,
      state: "official_verification_pending",
      totalItems: 2,
      verifiedItems: 2,
      pendingOfficialItems: 1,
    });
  });

  it("treats placeholder official metadata as blocking official readiness", () => {
    const placeholderTopic: Topic = {
      ...verifiedTopic,
      officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    };

    expect(buildContentReadiness([placeholderTopic], [verifiedQuestion])).toMatchObject({
      privateStudyReady: true,
      officialContentReady: false,
      state: "official_verification_pending",
      pendingOfficialItems: 1,
    });
  });

  it("marks empty sources as not ready for study", () => {
    expect(buildContentReadiness([], [])).toMatchObject({
      privateStudyReady: false,
      officialContentReady: false,
      state: "empty",
    });
  });
});
