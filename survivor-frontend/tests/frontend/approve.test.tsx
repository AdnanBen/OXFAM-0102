import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Approve from "../../src/pages/approve/[token]";

describe("Approve", () => {
  it("renders approve page and button", async () => {
    render(<Approve token="foo" />);

    await screen.findByText(
      "Are you sure you want to approve this user as a Moderator?"
    );
    await screen.findByText("Yes, approve account.");
  });
});
