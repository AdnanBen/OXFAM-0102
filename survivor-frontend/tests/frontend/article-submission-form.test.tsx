import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ArticleSubmissionForm from "../../src/pages/moderator/article-submission-form";

describe("Article submission form", () => {
  it("renders form", async () => {
    render(<ArticleSubmissionForm />);

    await screen.findByText("Title");
    await screen.findByText("Category");
    await screen.findByText("Resource body");
    await screen.findByText("Save new Resource");
  });
});
