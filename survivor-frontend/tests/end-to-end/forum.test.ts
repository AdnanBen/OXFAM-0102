import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";
import { Client } from "pg";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";

const { findByText, findAllByText, queryByText, queryAllByText, findByRole } =
  queries;

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

  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
  const forumBtns = await queryAllByText(document, "Forum");
  await forumBtns[0]!.evaluate((e) => e.click());
});

describe("forum", () => {
  test("loads successfully", async () => {
    await findAllByText(document, "Oxfam Survivors Community");
    await findByText(document, "Create new post?");
    await findByText(document, "General Discussion");
    await findByText(document, "Requests for Advice");
    await findByText(document, "Please select a category to find support", {
      exact: false,
    });
  });

  test("cannot navigate to forum directly", async () => {
    await page.goto(`${baseUrl}/forum`, { waitUntil: "networkidle0" });
    expect(page.url()).toContain("google.com");
    document = await getDocument(page);
    expect(await queryByText(document, "Oxfam Survivors Community")).toBe(null);
  });

  test("can navigate to board", async () => {
    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();
    await findByText(document, "Forum: General Discussion");
    await findByText(document, "There are no posts yet.");

    // Clicking back button should go back to main forum, not root homepage
    const backBtn = await findByText(document, "← Back");
    await backBtn.click();
    await findByText(document, "Create new post?");
  });

  test("can create post", async () => {
    const newPostBtn = await findByText(document, "Create new post?");
    await newPostBtn.click();
    await findByText(document, "New Forum Post");

    const titleInput = await findByRole(document, "textbox");
    await titleInput.type("Post Title");

    const selector = await findByText(document, "Please choose a category");
    await selector.click();
    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();

    const bodyInput = await page.$("[contenteditable=true]");
    expect(bodyInput).toBeTruthy();
    await bodyInput!.type("Test Body");

    const submitBtn = await findByText(document, "Submit New Post");
    await submitBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const posts = await client
      .query('SELECT * FROM "Post"')
      .then((res) => res.rows);
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toEqual("Post Title");
    expect(posts[0].body).toEqual("<p>Test Body</p>");
    expect(posts[0].board_id).toEqual(1);
  });

  test("can view post list", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id) VALUES ('Title', '<p>Body</p>', 1)`
    );

    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();
    await findByText(document, "Forum: General Discussion");

    const post = await findByText(document, "Title");
    await post.click();

    await findByText(document, "Title");
    await findByText(document, "Body");
    await findByText(document, "Replies");
    await findByText(document, "add comment?");
    await findByText(document, "Report post?");

    const noPostsMessage = await queryByText(
      document,
      "There are no posts yet."
    );
    expect(noPostsMessage).toEqual(null);
  });

  test("can add comment", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id) VALUES ('Title', '<p>Body</p>', 1)`
    );

    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();

    const post = await findByText(document, "Title");
    await post.click();

    const addCommentBtn = await findByText(document, "add comment?");
    await addCommentBtn.click();
    const commentInput = await findByRole(document, "textbox");
    await commentInput.type("Test comment body");
    const postCommentBtn = await findByText(document, "Post comment");
    await postCommentBtn.click();

    await findByText(document, "Test comment body");
    await findByText(document, "Report comment?");

    const comments = await client
      .query('SELECT * FROM "Comment"')
      .then((res) => res.rows);
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toEqual("Test comment body");
    expect(comments[0].parent_comment_id).toEqual(null);
    expect(comments[0].post_id).toEqual(1);
  });

  test("can report post", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id) VALUES ('Title', '<p>Body</p>', 1)`
    );

    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();

    const post = await findByText(document, "Title");
    await post.click();

    const reportBtn = await findByText(document, "Report post?");
    await reportBtn.click();
    await findByText(document, "The post was reported successfully.");

    const posts = await client
      .query(`SELECT * FROM "Post"`)
      .then((res) => res.rows);
    expect(posts).toHaveLength(1);
    expect(posts[0].flags).toEqual(1);
  });

  test("can report comment", async () => {
    await client.query(
      `INSERT INTO "Post" (title, body, board_id) VALUES ('Title', '<p>Body</p>', 1)`
    );
    await client.query(
      `INSERT INTO "Comment" (body, post_id) VALUES ('Test comment body', 1)`
    );

    const boardBtn = await findByText(document, "General Discussion");
    await boardBtn.click();

    const post = await findByText(document, "Title");
    await post.click();

    const reportBtn = await findByText(document, "Report comment?");
    await reportBtn.click();
    await findByText(document, "The comment was reported successfully.");

    const comments = await client
      .query(`SELECT * FROM "Comment"`)
      .then((res) => res.rows);
    expect(comments).toHaveLength(1);
    expect(comments[0].flags).toEqual(1);
  });
});
