import React from "react";
import { render, screen } from "@testing-library/react";
import { jest, describe, expect, it } from "@jest/globals";
import "@testing-library/jest-dom";
import FormPage from "../../src/pages/report";
import { ReactTestingLibraryProvider } from "./helpers";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    };
  },
}));

describe("Report Testing", () => {
    afterAll(() => {
        jest.resetModules();
        jest.resetAllMocks();
      });
  it("Should render the header, inputs and submit button.", () => {

    render(
      <FormPage name="mock name" situation="mock situation" />,
      { wrapper: ReactTestingLibraryProvider }
    );

    const reportNameInput = screen.getByTestId("report-name-input");
    const reportSituationInput = screen.getByTestId("report-situation-input");
    const submitReportBtn = screen.getByTestId("submit-report-btn");
    const reportHeader = screen.getByTestId("report-header");

    expect(reportHeader).toHaveTextContent(/Make a Report/);
    expect(reportNameInput).toHaveTextContent(/Name/);
    expect(reportSituationInput).toHaveTextContent(/Situation/);
    expect(submitReportBtn).toHaveTextContent(/Submit/);
  });
});
