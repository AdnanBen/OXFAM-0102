import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Post from "../../src/pages/forum/[id]";
import { ReactTestingLibraryProvider } from "./helpers";
import useRouterRefresh from "../../src/utils/useRouterRefresh";
jest.mock("../../src/server/auth", () => ({}));
jest.mock("../../src/utils/useRouterRefresh");

describe("Forum Testing", () => {
  beforeEach(() => {
    useRouterRefresh.mockReturnValue("");
  });


  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("Should render post and its properties correctly.", () => {
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

    const postTitle = screen.getByTestId("post-title");
    const postDate = screen.getByTestId("post-date");
    const postTag = screen.getByTestId("post-tag");
    const postBody = screen.getByTestId("post-body");

    expect(postTitle).toHaveTextContent("post title");
    expect(postDate).toHaveTextContent("Wed, 15 Mar 2023 22:23:47 GMT");
    expect(postTag).toHaveTextContent("tag 1");
    expect(postBody).toHaveTextContent("Post body");
  });

  it("Should render comments correctly.", () => {
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

    const commentBody = screen.getByTestId("comment-body");
    const parenCommentDate = screen.getByTestId("parent-comment-date");
    const parenCommentBody = screen.getByTestId("parent-comment-body");

    expect(commentBody).toHaveTextContent(/comment body/);
    expect(parenCommentDate).toHaveTextContent("on Wed, 15 Mar 2023 22:23:47 GMT");
    expect(parenCommentBody).toHaveTextContent("parent comment body");
  });

  it("Should render the report and add comment button.", () => {
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

    const reportCommentButton = screen.getByTestId("report-comment-btn");
    const addCommentButton = screen.getByTestId("add-comment-button");

    expect(addCommentButton).toHaveTextContent("add comment?");
    expect(reportCommentButton).toHaveTextContent("Report comment?");
  });
});
