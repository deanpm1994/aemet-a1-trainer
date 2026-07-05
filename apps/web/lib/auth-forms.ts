export type EmailPasswordInput = {
  email: string;
  password: string;
};

function readRequiredString(value: FormDataEntryValue | null, message: string) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    throw new Error(message);
  }

  return trimmed;
}

export function parseEmailPasswordForm(formData: FormData): EmailPasswordInput {
  return {
    email: readRequiredString(formData.get("email"), "El email es obligatorio."),
    password: readRequiredString(formData.get("password"), "La contraseña es obligatoria."),
  };
}
