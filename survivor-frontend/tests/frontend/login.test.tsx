import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Login from "../../src/pages/login";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Login", () => {
  it("renders the login button correctly", async () => {
    render(<Login />, { wrapper: ReactTestingLibraryProvider });
    await screen.findByText("Login as moderator/administrator");
  });
});
