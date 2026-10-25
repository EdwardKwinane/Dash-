import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search/search-bar";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("exposes an accessible search landmark and labelled input", () => {
    render(<SearchBar />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: /search products by name, brand or category/i,
      }),
    ).toBeInTheDocument();
  });

  it("navigates to a shareable search URL and normalises whitespace", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "  sony   headphones ");
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/search?q=sony%20headphones");
  });

  it("navigates to the search route for an empty query", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.click(screen.getByRole("searchbox"));
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith("/search");
  });

  it("keeps the input in sync with the URL query", () => {
    render(<SearchBar initialQuery="ipad" />);

    expect(screen.getByRole("searchbox")).toHaveValue("ipad");
  });

  it("clears the query and returns to the search route", async () => {
    const user = userEvent.setup();
    render(<SearchBar initialQuery="ipad" />);

    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(push).toHaveBeenCalledWith("/search");
  });

  it("calls onNavigate after a search so mobile menus can close", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<SearchBar onNavigate={onNavigate} />);

    await user.type(screen.getByRole("searchbox"), "dell{Enter}");

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
