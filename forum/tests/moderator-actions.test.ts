import { describe, test, expect } from "@jest/globals";
import supertest from "supertest";
import prisma from "../db";
import { app } from "../index";

const request = supertest(app);
describe("GET /moderator/comments/flagged", () => {
  test("returns no comments when no flagged comments exist", async () => {
    await request
      .get("/moderator/comments/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, comments: [] });
      });
  });

  test("returns no comments when flagged comments exist but are deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: {
          create: { body: "<p>test comment</p>", flags: 1, deleted: true },
        },
      },
    });

    await request
      .get("/moderator/comments/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, comments: [] });
      });
  });

  test("returns comments when flagged comments exist", async () => {
    const created = new Date();
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        board: { create: { name: "test" } },
        comments: {
          create: { body: "<p>test comment</p>", flags: 1, created },
        },
      },
    });

    await request
      .get("/moderator/comments/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          comments: [
            {
              created: created.toISOString(),
              id: 1,
              body: "<p>test comment</p>",
              flags: 1,
              Post: { id: 1, title: "Test" },
            },
          ],
        });
      });
  });
});

describe("DELETE /moderator/comments/:id/flags", () => {
  test("returns 404 when comment does not exist", async () => {
    await request.delete("/moderator/comments/1/flags").expect(404);
  });

  test("returns 404 when comment is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test comment</p>", deleted: true } },
      },
    });

    await request.delete("/moderator/comments/1/flags").expect(404);
  });

  test("updates flag count when comment exists", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test comment</p>" } },
      },
    });

    await request
      .delete("/moderator/comments/1/flags")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false });
      });

    expect((await prisma.comment.findFirst())?.flags).toEqual(0);
  });
});

describe("DELETE /moderator/comments/:id", () => {
  test("returns 404 when comment does not exist", async () => {
    await request.delete("/moderator/comments/1").expect(404);
  });

  test("returns 404 when comment is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test comment</p>", deleted: true } },
      },
    });

    await request.delete("/moderator/comments/1").expect(404);
  });

  test("marks comment as deleted and resets flag count when comment exists", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test comment</p>" } },
      },
    });

    await request
      .delete("/moderator/comments/1")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false });
      });

    const comment = await prisma.comment.findFirst();
    expect(comment?.flags).toEqual(0);
    expect(comment?.deleted).toEqual(true);
  });
});

describe("GET /moderator/posts/flagged", () => {
  test("returns no posts when no flagged posts exist", async () => {
    await request
      .get("/moderator/posts/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, posts: [] });
      });
  });

  test("returns no posts when flagged posts exist but are deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        deleted: true,
      },
    });

    await request
      .get("/moderator/posts/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, posts: [] });
      });
  });

  test("returns posts when flagged posts exist", async () => {
    const created = new Date();
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        board: { create: { name: "test" } },
        flags: 1,
      },
    });

    await request
      .get("/moderator/posts/flagged")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          posts: [
            {
              created: created.toISOString(),
              id: 1,
              title: "Test",
              body: "<p>test</p>",
              flags: 1,
            },
          ],
        });
      });
  });
});

describe("DELETE /moderator/posts/:id/flags", () => {
  test("returns 404 when post does not exist", async () => {
    await request.delete("/moderator/posts/1/flags").expect(404);
  });

  test("returns 404 when post is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        deleted: true,
      },
    });

    await request.delete("/moderator/posts/1/flags").expect(404);
  });

  test("updates flag count when post exists", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
      },
    });

    await request
      .delete("/moderator/posts/1/flags")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false });
      });

    expect((await prisma.post.findFirst())?.flags).toEqual(0);
  });
});

describe("DELETE /moderator/posts/:id", () => {
  test("returns 404 when post does not exist", async () => {
    await request.delete("/moderator/posts/1").expect(404);
  });

  test("returns 404 when post is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        deleted: true,
      },
    });

    await request.delete("/moderator/posts/1").expect(404);
  });

  test("marks post as deleted and resets flag count when post exists", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
      },
    });

    await request
      .delete("/moderator/posts/1")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false });
      });

    const post = await prisma.post.findFirst();
    expect(post?.flags).toEqual(0);
    expect(post?.deleted).toEqual(true);
  });
});
