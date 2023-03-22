import { afterAll, beforeAll, beforeEach, describe, test } from "@jest/globals";
import { MongoClient } from "mongodb";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { login } from "../helpers";

const { findByText } = queries;

const client = new MongoClient(
  `mongodb://USER:PASS@localhost:${databasePorts.reports}/reportdata`
);

beforeAll(() => client.connect());
afterAll(() => client.close());

var document: ElementHandle<Element>;

beforeEach(async () => {
  await client.db("reportdata").collection("reports").deleteMany();

  await login(page);
  await page.goto(`${baseUrl}/moderator/reports`, {
    waitUntil: "networkidle0",
  });
  document = await getDocument(page);
});

describe("moderator reports", () => {
  test("loads successfully", async () => {
    await findByText(document, "Reports");
    await findByText(document, "Report ID");
    await findByText(document, "Name");
    await findByText(document, "Situation");
  });

  test("can view reports", async () => {
    await client.db("reportdata").collection("reports").insertOne({
      name: "Test name",
      situation: "Test situation",
    });

    // Trigger re-fetch
    await page.reload();
    document = await getDocument(page);

    await findByText(document, "Test name");
    await findByText(document, "Test situation");
  });
});
