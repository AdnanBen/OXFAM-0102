import { getDocument, queries } from "pptr-testing-library";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { ElementHandle } from "puppeteer";
import { login } from "./helpers";

const { findByText, findAllByText, queryByText, queryAllByText, findByRole } =
  queries;

var document: ElementHandle<Element>;

beforeEach(async () => {
  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
  const chatBtns = await queryAllByText(document, "Chat");
  await chatBtns[0]!.evaluate((e) => e.click());
});

describe("chat", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Oxfam Survivors Community");
    await findAllByText(document, "Chat");
    await findByText(
      document,
      "There are no moderators available to chat at the moment."
    );
  });

  test("cannot navigate to chat directly", async () => {
    await page.goto(`${baseUrl}/chat`, { waitUntil: "networkidle0" });
    expect(page.url()).toContain("google.com");
    document = await getDocument(page);
    expect(await queryByText(document, "Oxfam Survivors Community")).toBe(null);
  });

  test("shows correct moderator availability", async () => {
    jest.setTimeout(10000);

    // Create incognito window for moderator
    const incognito = await browser.createIncognitoBrowserContext();
    const incognitoPage = await incognito.newPage();
    await login(incognitoPage);
    await incognitoPage.goto(`${baseUrl}/moderator/chat`, {
      waitUntil: "networkidle0",
    });
    const incognitoDocument = await getDocument(incognitoPage);
    await findByText(incognitoDocument, "Chat requests");
    await findByText(incognitoDocument, "Listening to chat requests...");

    // Make sure survivor page shows request buttons
    await findByText(document, "Request Chat", { exact: false });
    await findByText(document, "Request Call", { exact: false });
  }, 10000);

  test("can perform text chat", async () => {
    // Create incognito window for moderator
    const incognito = await browser.createIncognitoBrowserContext();
    const incognitoPage = await incognito.newPage();
    await login(incognitoPage);
    await incognitoPage.goto(`${baseUrl}/moderator/chat`, {
      waitUntil: "networkidle0",
    });
    const incognitoDocument = await getDocument(incognitoPage);

    // Request chat from survivor
    const startChatBtn = await findByText(document, "Request Chat", {
      exact: false,
    });
    await startChatBtn.click();

    // Moderator accept chat from survivor
    const acceptChatBtn = await findByText(incognitoDocument, "Accept chat");
    await acceptChatBtn.click();
    const modInput = await findByRole(incognitoDocument, "textbox");
    await modInput.type("Test message from moderator");
    const modSendMessageBtn = await findByText(
      incognitoDocument,
      "Send message"
    );
    await modSendMessageBtn.click();

    // Survivor should see message
    await findByText(document, "Test message from moderator", { exact: false });

    // Survivor sends message
    const survivorInput = await findByRole(document, "textbox");
    await survivorInput.type("Test message from survivor");
    const survivorSendMessageBtn = await findByText(document, "Send message");
    await survivorSendMessageBtn.click();

    // Moderator should see the message
    await findByText(incognitoDocument, "Test message from survivor", {
      exact: false,
    });
  }, 10000);

  test("can initiate voice chat", async () => {
    // Create incognito window for moderator
    const incognito = await browser.createIncognitoBrowserContext();
    const incognitoPage = await incognito.newPage();
    await login(incognitoPage);
    await incognitoPage.goto(`${baseUrl}/moderator/chat`, {
      waitUntil: "networkidle0",
    });
    const incognitoDocument = await getDocument(incognitoPage);

    // Request call from survivor
    const startCallBtn = await findByText(document, "Request Call", {
      exact: false,
    });
    await startCallBtn.click();

    // Moderator should see request from survivor
    const acceptChatBtn = await findByText(incognitoDocument, "Accept Call");
  }, 10000);
});
