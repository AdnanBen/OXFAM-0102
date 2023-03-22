import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";
import { MongoClient } from "mongodb";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";

const { findByText, findAllByText, queryByText, queryAllByText } = queries;

const client = new MongoClient(
  `mongodb://USER:PASS@localhost:${databasePorts.resources}/resources`
);

beforeAll(() => client.connect());
afterAll(() => client.close());

var document: ElementHandle<Element>;

beforeEach(async () => {
  await client.db("resources").collection("articles").deleteMany();

  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
  const resourceBtns = await queryAllByText(document, "Resources");
  await resourceBtns[0]!.evaluate((e) => e.click());
});

describe("resources", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Oxfam Survivors Community");
    await findAllByText(document, "Resources");
  });

  test("cannot navigate to resources directly", async () => {
    await page.goto(`${baseUrl}/resources`, { waitUntil: "networkidle0" });
    expect(page.url()).toContain("google.com");
    document = await getDocument(page);
    expect(await queryByText(document, "Oxfam Survivors Community")).toBe(null);
  });

  test("can see resources", async () => {
    await client.db("resources").collection("articles").insertOne({
      title: "Test Resource Title",
      body: "<p>Test Resource Body</p>",
      category: "Violence",
    });

    // Go back and re-visit page, to refresh resources (SSR)
    const backBtn = await findByText(document, "⮪ Back");
    await backBtn.click();
    const resourceBtns = await queryAllByText(document, "Resources");
    await resourceBtns[0]!.evaluate((e) => e.click());

    await findByText(document, "Violence");
    const resource = await findByText(document, "Test Resource Title");
    await resource.click();
    await findByText(document, "Test Resource Title");
    await findByText(document, "Test Resource Body");
    await findByText(document, "Violence");
  });
});
