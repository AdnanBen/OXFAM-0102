import { beforeEach, describe, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { login } from "../helpers";
const { findByText, findAllByText } = queries;

var document: ElementHandle<Element>;

beforeEach(async () => {
  await login(page);
  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("home page", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Oxfam Survivors Community");
    await findAllByText(document, "Forum");
    await findAllByText(document, "Chat");
    await findAllByText(document, "Resources");
    await findAllByText(document, "Report");
    await findByText(document, "Moderator");
    await findByText(document, "a safe-space for survivors", { exact: false });
    await findByText(document, "Language");
    await findByText(document, "Exit site quickly");
  });

  test("can navigate to and from moderator page", async () => {
    const modBtn = await findByText(document, "Moderator");
    await modBtn!.evaluate((e) => e.click());

    await findByText(document, "Moderator Dashboard");

    const backBtn = await findByText(document, "⮪ Back");
    await backBtn.click();

    // Should go back to homepage after clicking Back
    await findByText(document, "a safe-space for survivors", { exact: false });
  });
});
