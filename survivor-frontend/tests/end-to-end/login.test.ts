import { beforeEach, describe, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { login } from "./helpers";

const { findByText, findAllByText } = queries;

var document: ElementHandle<Element>;

beforeEach(async () => {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("login", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Login as moderator/administrator");
  });

  test("can login as moderator", async () => {
    await login(page);

    document = await getDocument(page);
    const modNavBtn = await findByText(document, "Moderator");
    await modNavBtn.evaluate((e) => e.click());

    await findByText(document, "View flags", { exact: false });
    await findByText(document, "Create new resource", { exact: false });
    await findByText(document, "View resources", { exact: false });
    await findByText(document, "Chat with survivors", { exact: false });
    await findByText(document, "View reports", { exact: false });
  });
});
