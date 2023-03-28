import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ArticlePage from "../../src/pages/resources/[resourceId]";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Resources Article", () => {
  it("renders article correctly", async () => {
    const articleMock = {
      title: "article one",
      category: "category 1",
      body: "<p>article body</p>",
    };
    render(<ArticlePage article={articleMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("category 1");
    await screen.findByText("article one");
    await screen.findByText("article body");
  });

  it("renders error message when no articles exist", async () => {
    render(<ArticlePage article={undefined} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText(
      "There was an error loading the resource. Please try again later."
    );
  });
});
