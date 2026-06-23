import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { buildSignInResult, buildSignOutResult, buildSignUpResult } from "./auth-actions";

describe("buildSignUpResult", () => {
  it("reports confirmation guidance when the user exists but session does not", () => {
    expect(
      buildSignUpResult({
        data: {
          user: { id: "user-1", email: "user@example.com" },
          session: null,
        },
        error: null,
      }),
    ).toEqual({
      ok: true,
      message:
        "Account created. If email confirmation is enabled in Supabase, confirm the email before signing in.",
      redirectTo: null,
    });
  });

  it("reports sign-up failures", () => {
    expect(
      buildSignUpResult({
        data: {
          user: null,
          session: null,
        },
        error: { message: "User already registered" },
      }),
    ).toEqual({
      ok: false,
      message: "User already registered",
      redirectTo: null,
    });
  });
});

describe("buildSignInResult", () => {
  it("redirects to settings on successful sign-in", () => {
    expect(
      buildSignInResult({
        data: {
          user: { id: "user-1", email: "user@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      }),
    ).toEqual({
      ok: true,
      message: "Signed in.",
      redirectTo: "/settings",
    });
  });

  it("shows auth failures without redirect", () => {
    expect(
      buildSignInResult({
        data: {
          user: null,
          session: null,
        },
        error: { message: "Invalid login credentials" },
      }),
    ).toEqual({
      ok: false,
      message: "Invalid login credentials",
      redirectTo: null,
    });
  });
});

describe("buildSignOutResult", () => {
  it("redirects home after sign-out", () => {
    expect(buildSignOutResult({ error: null })).toEqual({
      ok: true,
      redirectTo: "/",
    });
  });

  it("returns failure when sign-out errors", () => {
    expect(buildSignOutResult({ error: { message: "Sign-out failed" } })).toEqual({
      ok: false,
      redirectTo: null,
      message: "Sign-out failed",
    });
  });
});
