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
    email: readRequiredString(formData.get("email"), "Email is required."),
    password: readRequiredString(formData.get("password"), "Password is required."),
  };
}
