import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import ArticlePage from "../../src/pages/resources/[resourceId]";
import { ReactTestingLibraryProvider } from "./helpers";
jest.mock("../../src/server/auth", () => ({}));

describe("Resources Article Testing", () => {
  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });
  it("Should render article correctly.", () => {
    const articleMock = {
      title: "article one",
      category: "category 1",
      body: "<p>article body</p>",
    };
    render(<ArticlePage article={articleMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const articleCategory = screen.getByTestId("article-category");
    const articleTitle = screen.getByTestId("article-title");
    const articleBody = screen.getByTestId("article-body");

    expect(articleCategory).toHaveTextContent("category 1");
    expect(articleTitle).toHaveTextContent("article one");
    expect(articleBody).toHaveTextContent("article body");
  });

  it("Should render error message when no article.", () => {
    render(<ArticlePage article={undefined} />, {
      wrapper: ReactTestingLibraryProvider,
    });
    const noArticle = screen.getByTestId("no-article");
    expect(noArticle).toHaveTextContent("There was an error loading the resource. Please try again later.");
  });

});
