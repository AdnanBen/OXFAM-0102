import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FormPage from "../../src/pages/report";
import { ReactTestingLibraryProvider } from "./helpers";

describe("Report Testing", () => {
  it("renders the header, inputs and submit button.", async () => {
    render(<FormPage name="mock name" situation="mock situation" />, {
      wrapper: ReactTestingLibraryProvider,
    });

    await screen.findByText("Make a Report");
    await screen.findByText("Name");
    await screen.findByText("Situation");
    await screen.findByText("Submit");
  });
});
