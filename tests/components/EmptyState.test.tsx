// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { EmptyState } from "~/components/EmptyState";

afterEach(() => {
  cleanup();
});

describe("EmptyState", () => {
  it("presents no feeds as a neutral status with guidance", () => {
    render(<EmptyState />);

    expect(screen.getByRole("status")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "No RSS feeds found" }),
    ).toBeDefined();
    expect(
      screen.getByText("We couldn’t find a feed for this URL."),
    ).toBeDefined();
    expect(screen.queryByText("Error:")).toBeNull();
  });
});
