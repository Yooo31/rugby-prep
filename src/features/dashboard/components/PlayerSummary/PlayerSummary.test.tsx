import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PlayerSummary } from "./PlayerSummary";

describe("PlayerSummary", () => {
  it("affiche le nom, le poste et l'objectif lisibles", () => {
    render(
      <PlayerSummary
        firstName="Yoan"
        position="DEMI_MELEE"
        goal="EXPLOSIVITE"
      />,
    );

    expect(screen.getByText("Yoan")).toBeVisible();
    expect(screen.getByText("Demi de mêlée")).toBeVisible();
    expect(screen.getByText("Explosivité")).toBeVisible();
  });
});
