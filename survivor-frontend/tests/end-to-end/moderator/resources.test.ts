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
import { login } from "../helpers";

const { findByText, findAllByRole } = queries;

const client = new MongoClient(
  `mongodb://USER:PASS@localhost:${databasePorts.resources}/resources`
);

beforeAll(() => client.connect());
afterAll(() => client.close());

var document: ElementHandle<Element>;

beforeEach(async () => {
  await client.db("resources").collection("articles").deleteMany();

  await login(page);
  await page.goto(`${baseUrl}/moderator`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("moderator resources", () => {
  test("loads successfully", async () => {
    await findByText(document, "Create new resource", { exact: false });
    await findByText(document, "View resources", { exact: false });
  });

  test("can see resources", async () => {
    await client.db("resources").collection("articles").insertOne({
      title: "Test Resource Title",
      body: "<p>Test Resource Body</p>",
      category: "Violence",
    });

    const viewBtn = await findByText(document, "View resources", {
      exact: false,
    });
    await viewBtn.click();

    await findByText(document, "Test Resource Title");
    await findByText(document, "Test Resource Body");
    await findByText(document, "Category: Violence");
    await findByText(document, "Edit?");
    await findByText(document, "Delete?");
  });

  test("can delete resource", async () => {
    await client.db("resources").collection("articles").insertOne({
      title: "Test Resource Title",
      body: "<p>Test Resource Body</p>",
      category: "Violence",
    });

    const viewBtn = await findByText(document, "View resources", {
      exact: false,
    });
    await viewBtn.click();

    const deleteBtn = await findByText(document, "Delete?");
    await deleteBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resources = await client
      .db("resources")
      .collection("articles")
      .find()
      .toArray();

    expect(resources).toHaveLength(0);
  });

  test("can edit resource", async () => {
    await client.db("resources").collection("articles").insertOne({
      title: "Test Resource Title",
      body: "<p>Test Resource Body</p>",
      category: "Violence",
    });

    const viewBtn = await findByText(document, "View resources", {
      exact: false,
    });
    await viewBtn.click();

    const editBtn = await findByText(document, "Edit?");
    await editBtn.click();

    await findByText(document, "Title");
    await findByText(document, "Category");
    await findByText(document, "Resource body");

    const inputs = await findAllByRole(document, "textbox");
    await inputs[0]!.type(" Updated");
    await inputs[1]!.type(" Updated");

    const updateBtn = await findByText(document, "Update Resource");
    await updateBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resources = await client
      .db("resources")
      .collection("articles")
      .find()
      .toArray();

    expect(resources).toHaveLength(1);
    expect(resources[0]!.title).toEqual("Test Resource Title Updated");
    expect(resources[0]!.category).toEqual("Violence Updated");
  });

  test("can create resource", async () => {
    const createBtn = await findByText(document, "Create new resource", {
      exact: false,
    });
    await createBtn.click();

    await findByText(document, "Title");
    await findByText(document, "Category");
    await findByText(document, "Resource body");

    const inputs = await findAllByRole(document, "textbox");
    await inputs[0]!.type("Test Resource Title");
    await inputs[1]!.type("Violence");

    const bodyInput = await page.$("[contenteditable=true]");
    expect(bodyInput).toBeTruthy();
    await bodyInput!.type("Test Resource Body");

    const saveBtn = await findByText(document, "Save new Resource");
    await saveBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resources = await client
      .db("resources")
      .collection("articles")
      .find()
      .toArray();

    expect(resources).toHaveLength(1);
    expect(resources[0]!.title).toEqual("Test Resource Title");
    expect(resources[0]!.category).toEqual("Violence");
    expect(resources[0]!.body).toEqual("<p>Test Resource Body</p>");
  });
});
