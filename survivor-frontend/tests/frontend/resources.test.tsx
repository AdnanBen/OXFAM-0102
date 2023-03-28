import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ResourceHome from "../../src/pages/resources";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Resources", () => {
  it("renders articles correctly", async () => {
    const articlesMock = [
      { _id: 1, title: "article one", category: "category 1" },
      { _id: 2, title: "article two", category: "category 2" },
    ];
    render(<ResourceHome articles={articlesMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const articleOne = await screen.findByText("article one");
    expect((articleOne.parentElement as HTMLAnchorElement).href).toMatch(
      /\/resources\/1/
    );

    const articleTwo = await screen.findByText("article two");
    expect((articleTwo.parentElement as HTMLAnchorElement).href).toMatch(
      /\/resources\/2/
    );
  });

  it("renders category tabs correctly", async () => {
    const articlesMock = [
      { _id: 1, title: "article one", category: "category 1" },
      { _id: 2, title: "article two", category: "category 2" },
    ];
    render(<ResourceHome articles={articlesMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("category 1");
    await screen.findByText("category 2");
  });
});
