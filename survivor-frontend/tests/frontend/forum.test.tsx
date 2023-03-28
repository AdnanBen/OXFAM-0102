import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Feed from "../../src/pages/forum";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Forum", () => {
  it("should render create post button", async () => {
    render(<Feed boards={[]} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const btn = await screen.findByText("Create new post?");
    expect((btn.parentElement as HTMLAnchorElement).href).toMatch(
      /\/forum\/new/
    );
  });

  it("renders forum boards correctly", async () => {
    const boardsMock = [
      { id: 1, name: "board 1", description: "board 1 desc" },
      { id: 2, name: "board 2", description: "board 2 desc" },
    ];
    render(<Feed boards={boardsMock} />, {
      wrapper: ReactTestingLibraryProvider,
    });

    const board1 = await screen.findByText("board 1");
    await screen.findByText("board 1 desc");
    expect(
      (board1.parentElement?.parentElement as HTMLAnchorElement).href
    ).toMatch(/\/forum\/board\?boardId=1/);

    const board2 = await screen.findByText("board 2");
    await screen.findByText("board 2 desc");
    expect(
      (board2.parentElement?.parentElement as HTMLAnchorElement).href
    ).toMatch(/\/forum\/board\?boardId=2/);
  });

  it("renders error when there are no boards", async () => {
    render(<Feed boards={[]} />, {
      wrapper: ReactTestingLibraryProvider,
    });
    await screen.findByText("There are no boards yet.");
  });
});
