import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ signOut: vi.fn() }));
vi.mock("@/features/auth/server/actions", () => ({ signOut: mocks.signOut }));

import { SignOutButton } from "./SignOutButton";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.signOut.mockResolvedValue(undefined);
});

describe("SignOutButton", () => {
  it("déclenche la déconnexion au clic", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: /se déconnecter/i }));

    expect(mocks.signOut).toHaveBeenCalledTimes(1);
  });
});
