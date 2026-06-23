import Link from "next/link";

import { signOutCurrentUser } from "@/lib/auth-actions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function AuthStatus() {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href="/auth/sign-in"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign in
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-full border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
        Signed in{user.email ? `: ${user.email}` : ""}
      </span>
      <form
        action={async () => {
          "use server";
          await signOutCurrentUser();
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
