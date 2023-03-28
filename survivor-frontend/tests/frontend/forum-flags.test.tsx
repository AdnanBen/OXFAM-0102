import { describe, expect, it, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ForumFlags from "../../src/pages/moderator/forum-flags";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { articleId: 1 },
  }),
}));

describe("Forum Flags", () => {
  it("renders page", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
    render(<ForumFlags />);

    await screen.findByText("Forum Flags");
    await screen.findByText("Posts");
    await screen.findByText("Comments");
    expect(global.fetch).toBeCalledTimes(2);
  });
});
