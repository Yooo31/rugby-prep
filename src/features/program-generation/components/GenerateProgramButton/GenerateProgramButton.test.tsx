import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ generateProgram: vi.fn() }));
vi.mock("@/features/program-generation/server/generateProgram", () => ({
  generateProgram: mocks.generateProgram,
}));

import { GenerateProgramButton } from "./GenerateProgramButton";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.generateProgram.mockResolvedValue({});
});

describe("GenerateProgramButton", () => {
  it("déclenche la génération au clic", async () => {
    const user = userEvent.setup();
    render(<GenerateProgramButton />);

    await user.click(
      screen.getByRole("button", { name: /générer mon programme/i }),
    );

    expect(mocks.generateProgram).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur renvoyée et l'état d'envoi", async () => {
    let resolve!: (value: unknown) => void;
    mocks.generateProgram.mockImplementation(
      () => new Promise((r) => (resolve = r as (value: unknown) => void)),
    );
    const user = userEvent.setup();
    render(<GenerateProgramButton />);

    await user.click(
      screen.getByRole("button", { name: /générer mon programme/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /génération/i }),
      ).toBeDisabled();
    });

    await act(async () => {
      resolve({ error: "Échec de génération" });
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("Échec");
  });
});
