// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedResult } from "~/components/FeedResult";
import type { FeedResult as FeedResultType } from "~/lib/types";

const feed: FeedResultType = {
  url: "https://example.com/feed.xml",
  title: "Example feed",
  posts: [
    {
      title: "First post",
      url: "https://example.com/first",
      publishedAt: "2026-07-31T12:00:00.000Z",
    },
    {
      title: "Second post",
      url: "https://example.com/second",
      publishedAt: "2026-07-30T12:00:00.000Z",
    },
  ],
};

afterEach(() => {
  cleanup();
});

async function openPreview() {
  const user = userEvent.setup();
  render(<FeedResult feed={feed} />);

  const previewButton = screen.getByRole("button", {
    name: "Preview posts for Example feed",
  });
  previewButton.focus();
  await user.keyboard("{Enter}");

  const dialog = screen.getByRole("dialog", { name: "Recent posts" });
  const closeButton = within(dialog).getByRole("button", {
    name: "Close preview",
  });

  return { closeButton, dialog, previewButton, user };
}

describe("FeedResult preview dialog", () => {
  it("moves focus into the dialog when it opens", async () => {
    const { closeButton } = await openPreview();

    expect(document.activeElement).toBe(closeButton);
  });

  it("traps focus in both directions", async () => {
    const { closeButton, dialog, user } = await openPreview();
    const postLinks = within(dialog).getAllByRole("link");
    const lastPostLink = postLinks.at(-1);

    expect(lastPostLink).toBeDefined();

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(lastPostLink);

    await user.tab();
    expect(document.activeElement).toBe(closeButton);
  });

  it("closes on Escape and restores focus to the preview button", async () => {
    const { previewButton, user } = await openPreview();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Recent posts" })).toBeNull();
    expect(document.activeElement).toBe(previewButton);
  });

  it("restores focus after the close button is clicked", async () => {
    const { closeButton, previewButton, user } = await openPreview();

    await user.click(closeButton);

    expect(screen.queryByRole("dialog", { name: "Recent posts" })).toBeNull();
    expect(document.activeElement).toBe(previewButton);
  });
});
