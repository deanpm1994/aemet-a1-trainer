import { AuthForm } from "@/components/auth-form";
import { signUpWithEmailPassword } from "@/lib/auth-actions";

export default function SignUpPage() {
  return (
    <AuthForm
      title="Create account"
      description="Create a Supabase email-and-password account for saved settings. Email confirmation may be required depending on project configuration."
      submitLabel="Create account"
      helperText="Use an email and password that meet your Supabase project rules."
      action={signUpWithEmailPassword}
    />
  );
}
