import "server-only";

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
