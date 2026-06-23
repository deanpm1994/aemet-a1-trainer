import { AuthForm } from "@/components/auth-form";
import { signInWithEmailPassword } from "@/lib/auth-actions";

export default function SignInPage() {
  return (
    <AuthForm
      title="Sign in"
      description="Sign in with your Supabase email and password to save settings in the app."
      submitLabel="Sign in"
      helperText="Enter your existing account credentials."
      action={signInWithEmailPassword}
    />
  );
}
