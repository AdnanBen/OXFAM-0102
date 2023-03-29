import { beforeEach, describe, expect, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
const { findByText, findAllByText, queryAllByText } = queries;

var document: ElementHandle<Element>;

beforeEach(async () => {
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
    await findByText(document, "a safe-space for survivors", { exact: false });
    await findByText(document, "Language");
    await findByText(document, "Exit site quickly");

    // Ensure there are no references to moderator stuff anywhere
    const modText = await queryAllByText(document, /Moderator/g);
    expect(modText).toHaveLength(0);
  });

  test("can navigate to and from forum", async () => {
    const forumBtns = await queryAllByText(document, "Forum");
    await forumBtns[0]!.evaluate((e) => e.click());

    await findAllByText(document, "Forum");
    await findByText(document, "Create new post?");
    await findByText(document, "General Discussion");
    await findByText(document, "Requests for Advice");

    const errorMessages = await queryAllByText(document, "error", {
      exact: false,
    });
    expect(errorMessages).toHaveLength(0);

    const backBtn = await findByText(document, "← Back");
    await backBtn.click();

    // Should go back to homepage after clicking Back
    await findByText(document, "a safe-space for survivors", { exact: false });
  });

  test("can navigate to and from chat", async () => {
    const chatBtns = await queryAllByText(document, "Chat");
    await chatBtns[0]!.evaluate((e) => e.click());

    await findAllByText(document, "Chat");
    await findByText(
      document,
      "There are no moderators available to chat at the moment."
    );

    const errorMessages = await queryAllByText(document, "error", {
      exact: false,
    });
    expect(errorMessages).toHaveLength(0);

    const backBtn = await findByText(document, "← Back");
    await backBtn.click();

    // Should go back to homepage after clicking Back
    await findByText(document, "a safe-space for survivors", { exact: false });
  });

  test("can navigate to and from resources", async () => {
    const resourcesBtns = await queryAllByText(document, "Resources");
    await resourcesBtns[0]!.evaluate((e) => e.click());

    await findAllByText(document, "Resources");
    const errorMessages = await queryAllByText(document, "error", {
      exact: false,
    });
    expect(errorMessages).toHaveLength(0);

    const backBtn = await findByText(document, "← Back");
    await backBtn.click();

    // Should go back to homepage after clicking Back
    await findByText(document, "a safe-space for survivors", { exact: false });
  });

  test("can navigate to and from report", async () => {
    const reportBtns = await queryAllByText(document, "Report");
    await reportBtns[0]!.evaluate((e) => e.click());

    await findAllByText(document, "Report");
    await findByText(document, "Make a Report");
    await findByText(document, "Submit");
    const errorMessages = await queryAllByText(document, "error", {
      exact: false,
    });
    expect(errorMessages).toHaveLength(0);

    const backBtn = await findByText(document, "← Back");
    await backBtn.click();

    // Should go back to homepage after clicking Back
    await findByText(document, "a safe-space for survivors", { exact: false });
  });

  [
    "",
    "/forum-flags",
    "/article-submission-form",
    "/resources",
    "/chat",
    "/reports",
  ].forEach((path) => {
    test(`cannot navigate to moderator page: ${path}`, async () => {
      await page.goto(`${baseUrl}/moderator${path}`, {
        waitUntil: "networkidle0",
      });
      expect(!page.url().includes("moderator"));
      document = await getDocument(page);
      await findByText(document, "a safe-space for survivors", {
        exact: false,
      });
    });
  });
});
