import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";

import Home from "../../src/pages";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Home Testing", () => {
  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("Should render the descriptions and options correctly", () => {
    render(<Home />, { wrapper: ReactTestingLibraryProvider });

    const homeDescription = screen.getByTestId("home-description");
    const forumTitle = screen.getByTestId("forum-title");
    const forumDesp = screen.getByTestId("forum-description");
    const chatTitle = screen.getByTestId("chat-title");
    const chatDesp = screen.getByTestId("chat-description");
    const resourcesTitle = screen.getByTestId("resources-title");
    const resourcesDesp = screen.getByTestId("resources-description");
    const reportTitle = screen.getByTestId("report-title");
    const reportDesp = screen.getByTestId("report-description");

    expect(homeDescription).toHaveTextContent(
      "A safe-space for survivors to discuss and share their experiences of abuse, and get support."
    );
    expect(forumTitle).toHaveTextContent("Forum");
    expect(forumDesp).toHaveTextContent(
      "Safely discuss your concerns and receive feedback from the community."
    );
    expect(chatTitle).toHaveTextContent("Chat");
    expect(chatDesp).toHaveTextContent(
      "Chat individually with trained moderators for advice."
    );
    expect(resourcesTitle).toHaveTextContent("Resources");
    expect(resourcesDesp).toHaveTextContent(
      "Find free self-help and educational resources to help manage and recover from abuse."
    );
    expect(reportTitle).toHaveTextContent("Report");
    expect(reportDesp).toHaveTextContent(
      "Report severe abuse to receive help from trained responders."
    );
  });

  it("Should render the links of the options correctly", () => {
    render(<Home />, { wrapper: ReactTestingLibraryProvider });
    const reportLink = screen.getByTestId("report-link");
    const resourcesLink = screen.getByTestId("resources-link");
    const chatLink = screen.getByTestId("chat-link");
    const forumLink = screen.getByTestId("forum-link");
    expect(reportLink).toHaveAttribute("href", "/report");
    expect(resourcesLink).toHaveAttribute("href", "/resources");
    expect(chatLink).toHaveAttribute("href", "/chat");
    expect(forumLink).toHaveAttribute("href", "/forum");
  });
});
