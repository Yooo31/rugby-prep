import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock("@/features/auth/server/actions", () => ({ login: mocks.login }));

import { LoginForm } from "./LoginForm";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.login.mockResolvedValue({});
});

describe("LoginForm", () => {
  it("affiche les erreurs de validation et n'appelle pas l'action", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText("Adresse email invalide")).toBeVisible();
    expect(screen.getByText("Mot de passe requis")).toBeVisible();
    expect(mocks.login).not.toHaveBeenCalled();
  });

  it("appelle l'action de connexion avec des données valides", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret12");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(mocks.login).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    mocks.login.mockResolvedValue({
      error: "Email ou mot de passe incorrect.",
    });
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret12");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("incorrect");
  });

  it("désactive le bouton pendant la soumission", async () => {
    let resolve!: (value: unknown) => void;
    mocks.login.mockReset();
    mocks.login.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Mot de passe"), "secret12");
    await user.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    expect(screen.getByRole("button")).toHaveTextContent("Connexion…");

    await act(async () => {
      resolve({});
    });
  });
});
