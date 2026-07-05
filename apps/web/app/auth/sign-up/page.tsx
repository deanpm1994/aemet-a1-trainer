import { AuthForm } from "@/components/auth-form";
import { signUpWithEmailPassword } from "@/lib/auth-actions";

export default function SignUpPage() {
  return (
    <AuthForm
      title="Crear cuenta"
      description="Crea una cuenta de Supabase con email y contraseña para guardar ajustes. La confirmación por email puede ser necesaria según la configuración."
      submitLabel="Crear cuenta"
      helperText="Usa un email y una contraseña que cumplan las reglas del proyecto Supabase."
      action={signUpWithEmailPassword}
    />
  );
}
