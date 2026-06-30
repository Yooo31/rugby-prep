import { describe, expect, it } from "vitest";

import { cn } from "./utils";

// Smoke test : prouve que le pipeline (Vitest + coverage v8) tourne de bout en bout.
describe("cn", () => {
  it("concatène les classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("résout les conflits Tailwind (la dernière l'emporte)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignore les valeurs falsy et conditionnelles", () => {
    expect(cn("a", false, undefined, null, "", "b")).toBe("a b");
  });
});
