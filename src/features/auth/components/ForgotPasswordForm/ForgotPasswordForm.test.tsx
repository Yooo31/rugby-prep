import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requestPasswordReset: vi.fn() }));
vi.mock("@/features/auth/server/actions", () => ({
  requestPasswordReset: mocks.requestPasswordReset,
}));

import { ForgotPasswordForm } from "./ForgotPasswordForm";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requestPasswordReset.mockResolvedValue({});
});

describe("ForgotPasswordForm", () => {
  it("affiche une erreur de validation sur email invalide", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.click(screen.getByRole("button", { name: /envoyer le lien/i }));

    expect(await screen.findByText("Adresse email invalide")).toBeVisible();
    expect(mocks.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("affiche le message de succès renvoyé par le serveur", async () => {
    mocks.requestPasswordReset.mockResolvedValue({ success: "Email envoyé !" });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: /envoyer le lien/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Email envoyé");
    expect(mocks.requestPasswordReset).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur serveur", async () => {
    mocks.requestPasswordReset.mockResolvedValue({ error: "Échec d'envoi" });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: /envoyer le lien/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Échec");
  });

  it("désactive le bouton pendant la soumission", async () => {
    let resolve!: (value: unknown) => void;
    mocks.requestPasswordReset.mockReset();
    mocks.requestPasswordReset.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.click(screen.getByRole("button", { name: /envoyer le lien/i }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    expect(screen.getByRole("button")).toHaveTextContent("Envoi…");

    await act(async () => {
      resolve({});
    });
  });
});
