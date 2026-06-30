import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ updatePassword: vi.fn() }));
vi.mock("@/features/auth/server/actions", () => ({
  updatePassword: mocks.updatePassword,
}));

import { UpdatePasswordForm } from "./UpdatePasswordForm";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.updatePassword.mockResolvedValue({});
});

describe("UpdatePasswordForm", () => {
  it("affiche une erreur de validation", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.click(screen.getByRole("button", { name: /mettre à jour/i }));

    expect(await screen.findByText("8 caractères minimum")).toBeVisible();
    expect(mocks.updatePassword).not.toHaveBeenCalled();
  });

  it("appelle l'action avec des données valides", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(screen.getByLabelText("Nouveau mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /mettre à jour/i }));

    expect(mocks.updatePassword).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur serveur", async () => {
    mocks.updatePassword.mockResolvedValue({ error: "Échec de mise à jour" });
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(screen.getByLabelText("Nouveau mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /mettre à jour/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Échec");
  });

  it("désactive le bouton pendant la soumission", async () => {
    let resolve!: (value: unknown) => void;
    mocks.updatePassword.mockReset();
    mocks.updatePassword.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    await user.type(screen.getByLabelText("Nouveau mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /mettre à jour/i }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    expect(screen.getByRole("button")).toHaveTextContent("Mise à jour…");

    await act(async () => {
      resolve({});
    });
  });
});
