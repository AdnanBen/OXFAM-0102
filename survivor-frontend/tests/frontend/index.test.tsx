import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../../src/pages";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Homepage", () => {
  it("should render the descriptions and options correctly", async () => {
    render(<Home />, { wrapper: ReactTestingLibraryProvider });

    await screen.findByText(
      "A safe-space for survivors to discuss and share their experiences of abuse, and get support."
    );
    await screen.findAllByText("Forum");
    await screen.findByText(
      "Safely discuss your concerns and receive feedback from the community."
    );
    await screen.findAllByText("Chat");
    await screen.findByText(
      "Chat individually with trained moderators for advice."
    );
    await screen.findAllByText("Resources");
    await screen.findByText(
      "Find free self-help and educational resources to help manage and recover from abuse."
    );
    await screen.findAllByText("Report");
    await screen.findByText(
      "Report severe abuse to receive help from trained responders."
    );
  });

  it("should render the links of the options correctly", async () => {
    render(<Home />, { wrapper: ReactTestingLibraryProvider });
    const forumEl = await screen.findByText("Forum");
    expect((forumEl.closest("a") as HTMLAnchorElement).href).toMatch(/\/forum/);

    const reportEl = await screen.findByText("Report");
    expect((reportEl.closest("a") as HTMLAnchorElement).href).toMatch(
      /\/report/
    );

    const resourcesEl = await screen.findByText("Resources");
    expect((resourcesEl.closest("a") as HTMLAnchorElement).href).toMatch(
      /\/resources/
    );

    const chatEl = await screen.findByText("Chat");
    expect((chatEl.closest("a") as HTMLAnchorElement).href).toMatch(/\/chat/);
  });
});
