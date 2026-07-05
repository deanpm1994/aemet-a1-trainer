import { describe, expect, it } from "vitest";

import { parseEmailPasswordForm } from "./auth-forms";

describe("parseEmailPasswordForm", () => {
  it("returns trimmed email and password", () => {
    const formData = new FormData();
    formData.set("email", "  user@example.com  ");
    formData.set("password", "secret-pass");

    expect(parseEmailPasswordForm(formData)).toEqual({
      email: "user@example.com",
      password: "secret-pass",
    });
  });

  it("throws when email is missing", () => {
    const formData = new FormData();
    formData.set("password", "secret-pass");

    expect(() => parseEmailPasswordForm(formData)).toThrow("El email es obligatorio.");
  });

  it("throws when password is missing", () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");

    expect(() => parseEmailPasswordForm(formData)).toThrow("La contraseña es obligatoria.");
  });
});
