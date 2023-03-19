import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from "@jest/globals";
import { MongoClient } from "mongodb";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";

const {
  findByText,
  findAllByText,
  queryByText,
  queryAllByText,
  findAllByRole,
} = queries;

const client = new MongoClient(
  `mongodb://USER:PASS@localhost:${databasePorts.reports}/reportdata`
);

beforeAll(() => client.connect());
afterAll(() => client.close());

var document: ElementHandle<Element>;

beforeEach(async () => {
  await client.db("reportdata").collection("reports").deleteMany();

  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
  const reportBtns = await queryAllByText(document, "Report");
  await reportBtns[0]!.evaluate((e) => e.click());
});

describe("reports", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Oxfam Survivors Community");
    await findByText(document, "Report");
    await findByText(document, "Make a Report");
    await findByText(document, "Name");
    await findByText(document, "Situation");
    await findByText(document, "Submit");
  });

  test("cannot navigate to reports directly", async () => {
    await page.goto(`${baseUrl}/reports`, { waitUntil: "networkidle0" });
    expect(page.url()).toContain("google.com");
    document = await getDocument(page);
    expect(await queryByText(document, "Oxfam Survivors Community")).toBe(null);
  });

  test("can submit report", async () => {
    const inputs = await findAllByRole(document, "textbox");
    expect(inputs).toHaveLength(2);
    await inputs[0]!.type("Test Name");
    await inputs[1]!.type("Test Situation");

    const submitBtn = await findByText(document, "Submit");
    await submitBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const reports = await client
      .db("reportdata")
      .collection("reports")
      .find()
      .toArray();

    expect(reports).toHaveLength(1);
    expect(reports[0]!._id).toBeTruthy();
    expect(reports[0]!.name).toEqual("Test Name");
    expect(reports[0]!.situation).toEqual("Test Situation");

    // Clicking back button should go back to root homepage
    const backBtn = await findByText(document, "⮪ Back");
    await backBtn.click();
    await findByText(document, "A safe-space for survivors", { exact: false });
  });
});
