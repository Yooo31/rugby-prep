import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createProfile: vi.fn() }));

vi.mock("@/features/profiles", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/profiles")>();
  return { ...actual, createProfile: mocks.createProfile };
});

import { OnboardingForm } from "./OnboardingForm";

async function choose(user: UserEvent, combobox: RegExp, option: string) {
  await user.click(screen.getByRole("combobox", { name: combobox }));
  await user.click(await screen.findByRole("option", { name: option }));
}

async function fillValidForm(user: UserEvent) {
  await user.type(screen.getByLabelText("Prénom"), "Yoan");
  await choose(user, /poste/i, "Pilier");
  await choose(user, /objectif principal/i, "Musculation");
  await choose(user, /séances par semaine/i, "3 séances");
  await choose(user, /durée d'une séance/i, "60 minutes");
  await choose(user, /environnement/i, "Maison");
  await choose(user, /période de saison/i, "Inter-saison");
  // Coche puis décoche un jour (couvre les deux branches du groupe).
  const lundi = screen.getByRole("checkbox", { name: "Lundi" });
  await user.click(lundi);
  await user.click(lundi);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createProfile.mockResolvedValue({});
});

describe("OnboardingForm", () => {
  it("affiche les erreurs de validation et n'appelle pas l'action", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<OnboardingForm />);

    await user.click(
      screen.getByRole("button", { name: /valider mon profil/i }),
    );

    expect(await screen.findByText("Prénom requis")).toBeVisible();
    expect(mocks.createProfile).not.toHaveBeenCalled();
  });

  it("soumet un profil valide et affiche l'état d'envoi", async () => {
    let resolve!: (value: unknown) => void;
    mocks.createProfile.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<OnboardingForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /valider mon profil/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /création/i })).toBeDisabled();
    });
    expect(mocks.createProfile).toHaveBeenCalledTimes(1);
    const arg = mocks.createProfile.mock.calls[0]![0];
    expect(arg).toMatchObject({ firstName: "Yoan", position: "PILIER" });

    await act(async () => {
      resolve({});
    });
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    mocks.createProfile.mockResolvedValue({ error: "Échec d'enregistrement" });
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<OnboardingForm />);

    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /valider mon profil/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("Échec");
  });
});
