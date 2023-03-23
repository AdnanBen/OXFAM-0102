import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import ResourceHome from "../../src/pages/resources";
import { ReactTestingLibraryProvider } from "./helpers";
jest.mock("../../src/server/auth", () => ({}));

describe("Resources Testing", () => {

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("Should render articles correctly.", () => {
    const articlesMock = [
      {
        _id: 1,
        title: "article one",
        category: "category 1",
      },
      {
        _id: 2,
        title: "article two",
        category: "category 2",
      },
    ];
    render(<ResourceHome articles={articlesMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const articleLink = screen.queryAllByTestId("article-link");
    const articleTitle = screen.queryAllByTestId("article-title");

    expect(articleLink[0]).toHaveAttribute("href", "/resources/1");
    expect(articleTitle[0]).toHaveTextContent("article one");
    expect(articleLink[1]).toHaveAttribute("href", "/resources/2");
    expect(articleTitle[1]).toHaveTextContent("article two");
  });

  it("Should render category tabs correctly.", () => {
    const articlesMock = [
      {
        _id: 1,
        title: "article one",
        category: "category 1",
      },
      {
        _id: 2,
        title: "article two",
        category: "category 2",
      },
    ];
    render(<ResourceHome articles={articlesMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const articleLink = screen.queryAllByTestId("article-link");
    const articleTitle = screen.queryAllByTestId("article-title");
    const resourcesCategories = screen.queryAllByTestId("resources-categories");


    expect(articleLink[0]).toHaveAttribute("href", "/resources/1");
    expect(articleTitle[0]).toHaveTextContent("article one");
    expect(articleLink[1]).toHaveAttribute("href", "/resources/2");
    expect(articleTitle[1]).toHaveTextContent("article two");
    expect(resourcesCategories[0]).toHaveTextContent("category 1");
    expect(resourcesCategories[1]).toHaveTextContent("category 2");

  });
});
