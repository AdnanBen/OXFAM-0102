import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ModeratorDashboard from "../../src/pages/moderator";

describe("Moderator Dashboard", () => {
  it("renders links", async () => {
    render(<ModeratorDashboard />);

    await screen.findByText("Moderator Dashboard");

    await screen.findByText(
      "Manage reports of abuse/spam flagged on the forum."
    );
    await screen.findByText("View flags", { exact: false });

    await screen.findByText("Manage resources available to survivors.");
    await screen.findByText("Create new resource", { exact: false });
    await screen.findByText("View resources", { exact: false });

    await screen.findByText(
      "Provide live, one-to-one, confidential support with survivors."
    );
    await screen.findByText("Chat with survivors", { exact: false });

    await screen.findByText("Manage reports submitted by survivors.");
    await screen.findByText("View reports", { exact: false });
  });
});
