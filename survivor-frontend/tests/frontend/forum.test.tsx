import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Feed from "../../src/pages/forum";
import { ReactTestingLibraryProvider } from "./helpers";

jest.mock("../../src/server/auth", () => ({}));

describe("Forum Testing", () => {
  it("Should render create post button correctly.", () => {
    const boardsMock = [
      {
        id: 1,
        name: "board 1",
        description: "board 1 desp",
      },
      {
        id: 2,
        name: "board 2",
        description: "board 2 desp",
      },
    ];
    render(<Feed boards={boardsMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const forumCreateLink = screen.getByTestId("forum-create-link");

    expect(forumCreateLink).toHaveAttribute("href", "/forum/new");
    expect(forumCreateLink).toHaveTextContent("Create new post");
  });

  it("Should render forum boards correctly.", () => {
    const boardsMock = [
      {
        id: 1,
        name: "board 1",
        description: "board 1 desp",
      },
      {
        id: 2,
        name: "board 2",
        description: "board 2 desp",
      },
    ];
    render(<Feed boards={boardsMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const forumBoards = screen.queryAllByTestId("forum-boards-link");

    expect(forumBoards[0]).toHaveAttribute("href", "/forum/board?boardId=1");
    expect(forumBoards[0]).toHaveTextContent(/board 1/);
    expect(forumBoards[0]).toHaveTextContent(/board 1 desp/);
    expect(forumBoards[1]).toHaveAttribute("href", "/forum/board?boardId=2");
    expect(forumBoards[1]).toHaveTextContent(/board 2 desp/);
  });

  it("Should render error when there are no boards", () => {
    const boardsMock = [];
    render(<Feed boards={boardsMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });
    expect(screen.findByText("There are no boards yet")).toBeDefined();
  });

});
