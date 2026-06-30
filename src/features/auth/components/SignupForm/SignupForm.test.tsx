import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ signup: vi.fn() }));
vi.mock("@/features/auth/server/actions", () => ({ signup: mocks.signup }));

import { SignupForm } from "./SignupForm";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.signup.mockResolvedValue({});
});

describe("SignupForm", () => {
  it("affiche les erreurs de validation", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(await screen.findByText("Adresse email invalide")).toBeVisible();
    expect(screen.getByText("8 caractères minimum")).toBeVisible();
    expect(mocks.signup).not.toHaveBeenCalled();
  });

  it("appelle l'action avec des données valides", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(mocks.signup).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur serveur", async () => {
    mocks.signup.mockResolvedValue({ error: "Compte impossible" });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("impossible");
  });

  it("désactive le bouton pendant la soumission", async () => {
    let resolve!: (value: unknown) => void;
    mocks.signup.mockReset();
    mocks.signup.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "password1");
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "password1",
    );
    await user.click(screen.getByRole("button", { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    expect(screen.getByRole("button")).toHaveTextContent("Création…");

    await act(async () => {
      resolve({});
    });
  });
});
