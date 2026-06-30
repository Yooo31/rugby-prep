import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyProgram } from "./EmptyProgram";

describe("EmptyProgram", () => {
  it("affiche le placeholder et un CTA désactivé", () => {
    render(<EmptyProgram />);

    expect(screen.getByText("Aucun programme pour le moment")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /générer mon programme/i }),
    ).toBeDisabled();
  });
});
