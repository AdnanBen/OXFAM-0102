import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { ReactTestingLibraryProvider } from "./helpers";
import Board from '../../src/pages/forum/board'; 
jest.mock("../../src/server/auth", () => ({}));

describe("Board Testing", () => {
  it("Should render posts and the board name correctly.", () => {
    const postMock = [
        {
            id: 1,
            title: 'post one',
            tag: 'tag one',
            created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
        }, 
        {
            id: 2,
            title: 'post two',
            tag: 'tag two',
            created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
        }
    ];
    render(<Board posts={postMock}  boardName="board name"/>, {
      wrapper: ReactTestingLibraryProvider,
    });
    const boardName = screen.getByTestId("board-name");
    const postLink = screen.queryAllByTestId("post-link");
    const postTitle = screen.queryAllByTestId("post-title");
    const postTag = screen.queryAllByTestId("post-tag");
    const postDate = screen.queryAllByTestId("post-date");

    expect(boardName).toHaveTextContent("board name");
    expect(postLink[0]).toHaveAttribute('href', '/forum/1');
    expect(postLink[1]).toHaveAttribute('href', '/forum/2');
    expect(postTitle[0]).toHaveTextContent("post one");
    expect(postTitle[1]).toHaveTextContent("post two");
    expect(postTag[0]).toHaveTextContent("tag one");
    expect(postTag[1]).toHaveTextContent("tag two");
    expect(postDate[0]).toHaveTextContent("Wed, 15 Mar 2023 22:23:47 GMT");
    expect(postDate[1]).toHaveTextContent("Wed, 15 Mar 2023 22:23:47 GMT");
  });

  it("Should render error message when there is no posts.", () => {
    const postMock = [];
    render(<Board posts={postMock}  boardName="board name"/>, {
      wrapper: ReactTestingLibraryProvider,
    });

    const postTitle = screen.getByTestId("boards-no-posts");
    expect(postTitle).toHaveTextContent("There are no posts yet.");
  });

});
