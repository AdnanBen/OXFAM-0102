import { getDocument, queries } from "pptr-testing-library";
import { Page } from "puppeteer";

const { findByText, findByRole } = queries;

export async function login(page: Page) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle0" });
  let document = await getDocument(page);
  const loginBtn = await findByText(
    document,
    "Login as moderator/administrator"
  );
  await loginBtn.click();
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  document = await getDocument(page);
  const input = await findByRole(document, "textbox");
  await input.type("test@example.com");
  const signInBtn = await findByText(document, "Sign in with credentials");
  await signInBtn.click();
  await page.waitForNavigation();
}
