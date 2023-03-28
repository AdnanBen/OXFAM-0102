import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Board from "../../src/pages/forum/board";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Forum Board", () => {
  it("renders posts and board name correctly", async () => {
    const postMock = [
      {
        id: 1,
        title: "post one",
        tag: "tag one",
        created: "Wed Mar 15 2023 22:23:47 GMT+0000 (GMT)",
      },
      {
        id: 2,
        title: "post two",
        tag: "tag two",
        created: "Wed Mar 16 2023 22:23:47 GMT+0000 (GMT)",
      },
    ];
    render(<Board posts={postMock} boardName="board name" />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("board name", { exact: false });

    const el = await screen.findByText("post one");
    expect((el.parentElement?.parentElement as HTMLAnchorElement).href).toMatch(
      /\/forum\/1/
    );
    await screen.findByText("tag one");
    await screen.findByText("Wed, 15 Mar 2023 22:23:47 GMT");

    await screen.findByText("post two");
    await screen.findByText("tag two");
    await screen.findByText("Thu, 16 Mar 2023 22:23:47 GMT");
    expect((el.parentElement?.parentElement as HTMLAnchorElement).href).toMatch(
      /\/forum\/1/
    );
  });

  it("Should render error message when there is no posts.", async () => {
    render(<Board posts={[]} boardName="board name" />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("There are no posts yet.");
  });
});
