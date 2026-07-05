import { AuthForm } from "@/components/auth-form";
import { signInWithEmailPassword } from "@/lib/auth-actions";

export default function SignInPage() {
  return (
    <AuthForm
      title="Iniciar sesión"
      description="Inicia sesión con email y contraseña de Supabase para guardar ajustes en la app."
      submitLabel="Iniciar sesión"
      helperText="Introduce tus credenciales existentes."
      action={signInWithEmailPassword}
    />
  );
}
