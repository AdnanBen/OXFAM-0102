import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import Login from "../../src/pages/login";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Login Testing", () => {
  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });
  it("Should render the login button correctly", () => {
    render(<Login />, { wrapper: ReactTestingLibraryProvider });
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toHaveTextContent("Login as moderator/administrator");
  });
});
