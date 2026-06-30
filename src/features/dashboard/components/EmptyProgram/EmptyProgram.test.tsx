import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/program-generation", () => ({
  GenerateProgramButton: () => <button>Générer mon programme</button>,
}));

import { EmptyProgram } from "./EmptyProgram";

describe("EmptyProgram", () => {
  it("affiche le placeholder et le bouton de génération", () => {
    render(<EmptyProgram />);

    expect(screen.getByText("Aucun programme pour le moment")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /générer mon programme/i }),
    ).toBeVisible();
  });
});
