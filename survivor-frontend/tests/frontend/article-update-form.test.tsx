import { describe, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ArticleUpdateForm from "../../src/pages/moderator/article-update-form";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { articleId: 1 },
  }),
}));

describe("Article update form", () => {
  it("renders form", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
    render(<ArticleUpdateForm />);

    await screen.findByText("Title");
    await screen.findByText("Category");
    await screen.findByText("Resource body");
    await screen.findByText("Update Resource");
  });
});
