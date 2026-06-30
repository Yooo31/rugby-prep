import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SessionStatusBadge } from "./SessionStatusBadge";

describe("SessionStatusBadge", () => {
  it("rend les trois statuts avec le bon libellé", () => {
    const { rerender } = render(<SessionStatusBadge status="A_FAIRE" />);
    expect(screen.getByText("À faire")).toBeVisible();

    rerender(<SessionStatusBadge status="EN_COURS" />);
    expect(screen.getByText("En cours")).toBeVisible();

    rerender(<SessionStatusBadge status="TERMINEE" />);
    expect(screen.getByText("Terminée")).toBeVisible();
  });
});
