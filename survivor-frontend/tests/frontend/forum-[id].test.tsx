import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Post from "../../src/pages/forum/[id]";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Forum Post", () => {
  it("renders post and its properties correctly", async () => {
    const postMock = {
      id: 1,
      title: "post title",
      created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
      tag: "tag 1 ",
      body: "<p>Post body</p>",
      comments: [],
    };
    render(<Post post={postMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("post title");
    await screen.findByText("Wed, 15 Mar 2023 22:23:47 GMT");
    await screen.findByText("tag 1");
    await screen.findByText("Post body");
  });

  it("renders comments correctly", async () => {
    const postMock = {
      id: 1,
      title: "post title",
      created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
      tag: "tag 1 ",
      body: "<p>Post body</p>",
      comments: [
        {
          parent_comment: {
            created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
            body: "parent comment body",
          },
          body: "comment body",
          id: "1",
        },
      ],
    };
    render(<Post post={postMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    expect(screen.getAllByText(/comment body/)).toHaveLength(2);
    await screen.findByText("on Wed, 15 Mar 2023 22:23:47 GMT");
    await screen.findByText("parent comment body");
  });

  it("renders the report and add comment buttons", async () => {
    const postMock = {
      id: 1,
      title: "post title",
      created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
      tag: "tag 1 ",
      body: "<p>Post body</p>",
      comments: [
        {
          parent_comment: {
            created: "createdDate",
            body: "parent comment body",
          },
          body: "comment body",
          id: "1",
        },
      ],
    };
    render(<Post post={postMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("add comment?");
    await screen.findByText("Report comment?");
  });
});
