import "server-only";

import { redirect } from "next/navigation";

import { parseEmailPasswordForm } from "./auth-forms";
import { createSupabaseServerClient } from "./supabase-server";

type AuthResponse = {
  data: {
    user: { id: string; email?: string | null } | null;
    session: { access_token: string } | null;
  };
  error: { message: string } | null;
};

type SignOutResponse = {
  error: { message: string } | null;
};

export type AuthFormState = {
  message: string;
};

export type AuthActionResult = {
  ok: boolean;
  message: string;
  redirectTo: string | null;
};

export function buildSignUpResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message:
      "Account created. If email confirmation is enabled in Supabase, confirm the email before signing in.",
    redirectTo: null,
  };
}

export function buildSignInResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message: "Signed in.",
    redirectTo: "/settings",
  };
}

export function buildSignOutResult(response: SignOutResponse) {
  if (response.error) {
    return {
      ok: false,
      redirectTo: null,
      message: response.error.message,
    };
  }

  return {
    ok: true,
    redirectTo: "/",
  };
}

export async function signUpWithEmailPassword(
  _previousState: AuthFormState,
  formData: FormData,
) {
  "use server";

  const credentials = parseEmailPasswordForm(formData);
  const client = await createSupabaseServerClient();
  const result = buildSignUpResult(
    await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    }),
  );

  return {
    message: result.message,
  };
}

export async function signInWithEmailPassword(
  _previousState: AuthFormState,
  formData: FormData,
) {
  "use server";

  const credentials = parseEmailPasswordForm(formData);
  const client = await createSupabaseServerClient();
  const result = buildSignInResult(
    await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    }),
  );

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return {
    message: result.message,
  };
}

export async function signOutCurrentUser() {
  "use server";

  const client = await createSupabaseServerClient();
  const result = buildSignOutResult(await client.auth.signOut());

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}
