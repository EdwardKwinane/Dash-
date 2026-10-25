import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/account",
}));

import AccountPage from "./page";

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect: vi.fn(async () => ({})),
  },
  currentUser: vi.fn(async () => ({
    id: "test-user-1",
    firstName: "Test",
    emailAddresses: [{ emailAddress: "test@dash.app" }],
  })),
}));

describe("Account page", () => {
  it("renders overview for signed-in user", async () => {
    const page = await AccountPage();
    render(page);
    expect(screen.getByRole("heading", { name: /my account/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
