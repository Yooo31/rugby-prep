import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProgramOverview } from "./ProgramOverview";

describe("ProgramOverview", () => {
  it("affiche le numéro de semaine, le nombre de séances (pluriel) et les statuts", () => {
    render(
      <ProgramOverview
        week={{
          weekNumber: 3,
          sessionCount: 2,
          sessions: [
            { id: "s1", name: "Haut du corps", status: "TERMINEE" },
            { id: "s2", name: "Bas du corps", status: "A_FAIRE" },
          ],
        }}
      />,
    );

    expect(screen.getByText("Semaine 3")).toBeVisible();
    expect(screen.getByText("2 séances prévues")).toBeVisible();
    expect(screen.getByText("Haut du corps")).toBeVisible();
    expect(screen.getByText("Bas du corps")).toBeVisible();
    expect(screen.getByText("Terminée")).toBeVisible();
    expect(screen.getByText("À faire")).toBeVisible();
  });

  it("gère le singulier et le statut En cours", () => {
    render(
      <ProgramOverview
        week={{
          weekNumber: 1,
          sessionCount: 1,
          sessions: [{ id: "s1", name: "Séance unique", status: "EN_COURS" }],
        }}
      />,
    );

    expect(screen.getByText("1 séance prévue")).toBeVisible();
    expect(screen.getByText("En cours")).toBeVisible();
  });
});
