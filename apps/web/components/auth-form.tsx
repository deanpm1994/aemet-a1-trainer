"use client";

import { useActionState } from "react";

import type { AuthFormState } from "@/lib/auth-actions";

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  helperText: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  helperText,
  action,
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    message: helperText,
  });

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="text-sm leading-6 text-ink/70">{description}</p>
      </div>
      <form className="mt-6 space-y-4" action={formAction}>
        <label className="space-y-2 text-sm text-ink/80">
          <span>Email</span>
          <input
            name="email"
            type="email"
            className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
        </label>
        <label className="space-y-2 text-sm text-ink/80">
          <span>Password</span>
          <input
            name="password"
            type="password"
            className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
        </label>
        <p className="text-sm text-ink/70">{state.message}</p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          {isPending ? "Submitting..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
