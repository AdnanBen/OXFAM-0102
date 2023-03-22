import { getDocument, queries } from "pptr-testing-library";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";
import { ElementHandle } from "puppeteer";
import { Client } from "pg";
import { login } from "../helpers";

const { findByText, findAllByText } = queries;

const client = new Client({
  port: databasePorts.forum,
  user: "USER",
  password: "PASS",
  database: "forum",
});

beforeAll(() => client.connect());
afterAll(() => client.end());

var document: ElementHandle<Element>;

beforeEach(async () => {
  await client.query(`TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE`);

  await login(page);
  await page.goto(`${baseUrl}/moderator/forum-flags`, {
    waitUntil: "networkidle0",
  });
  document = await getDocument(page);
});

describe("moderator forum", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Forum Flags");
    await findByText(document, "Posts");
    await findByText(document, "Comments");
    await findAllByText(document, "No data found");
  });

  test("can see post and comment flags navigate to board", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id, flags) VALUES ('Title', '<p>Body</p>', 1, 1)`
    );
    await client.query(
      `INSERT INTO "Comment" (body, post_id, flags) VALUES ('<p>Comment body</p>', 1, 2)`
    );

    // Trigger re-fetch
    await page.reload();
    document = await getDocument(page);

    await findByText(document, "Body");
    await findByText(document, "Delete post");

    await findByText(document, "Comment body");
    await findByText(document, "Delete comment");

    expect(await findAllByText(document, "Dismiss flags")).toHaveLength(2);
  });

  test("can delete flagged post", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id, flags) VALUES ('Title', '<p>Body</p>', 1, 1)`
    );

    // Trigger re-fetch
    await page.reload();
    document = await getDocument(page);

    const deleteBtn = await findByText(document, "Delete post");
    await deleteBtn.click();
    await findByText(document, "The content was successfully deleted.");

    const posts = await client
      .query(`SELECT * FROM "Post"`)
      .then((res) => res.rows);
    expect(posts.length).toEqual(1);
    expect(posts[0].deleted).toEqual(true);
    expect(posts[0].flags).toEqual(0);
  });

  test("can dismiss flagged comment", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id, flags) VALUES ('Title', '<p>Body</p>', 1, 0)`
    );
    await client.query(
      `INSERT INTO "Comment" (body, post_id, flags) VALUES ('<p>Comment body</p>', 1, 2)`
    );

    // Trigger re-fetch
    await page.reload();
    document = await getDocument(page);

    const dismissBtn = await findByText(document, "Dismiss flags");
    await dismissBtn.click();
    await findByText(document, "The flags were successfully dismissed.");

    const comments = await client
      .query(`SELECT * FROM "Comment"`)
      .then((res) => res.rows);
    expect(comments.length).toEqual(1);
    expect(comments[0].deleted).toEqual(false);
    expect(comments[0].flags).toEqual(0);
  });
});
