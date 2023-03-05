import { describe, test, expect } from "@jest/globals";
import supertest from "supertest";
import prisma from "../db";
import { app } from "../index";

const request = supertest(app);
describe("GET /posts", () => {
  test("returns no posts when none exist", async () => {
    await request
      .get("/posts")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, posts: [] });
      });
  });

  test("returns no posts when none exist given board filter", async () => {
    await request
      .get("/posts?board_id=1")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, posts: [] });
      });
  });

  test("returns posts when they exist", async () => {
    const created = new Date();
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        board: { create: { name: "test" } },
      },
    });

    await request
      .get("/posts")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          posts: [{ title: "Test", created: created.toISOString(), id: 1 }],
        });
      });
  });

  test("returns correct posts when filtered by board", async () => {
    const created = new Date();
    await prisma.board.createMany({
      data: [{ name: "Test" }, { name: "Test 2" }],
    });

    await prisma.post.createMany({
      data: [
        {
          body: "<p>test</p>",
          title: "Test",
          created,
          board_id: 1,
        },
        {
          body: "<p>test2</p>",
          title: "Test 2",
          created,
          board_id: 2,
        },
      ],
    });

    await request
      .get("/posts?board_id=1")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          posts: [{ title: "Test", created: created.toISOString(), id: 1 }],
        });
      });
  });

  test("does not return deleted posts", async () => {
    const created = new Date();
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        deleted: true,
        board: { create: { name: "test" } },
      },
    });

    await request
      .get("/posts")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, posts: [] });
      });
  });
});

describe("GET /posts/:id", () => {
  test("returns 404 if post does not exist", async () => {
    await request.get("/posts/1").expect(404);
  });

  test("returns post data if it exists", async () => {
    const created = new Date();

    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        board: { create: { name: "test" } },
      },
    });

    await request
      .get("/posts/1")
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.post).toEqual({
          body: "<p>test</p>",
          title: "Test",
          created: created.toISOString(),
          comments: [],
          id: 1,
        });
      });
  });

  test("returns 404 if post deleted", async () => {
    const created = new Date();

    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        created,
        deleted: true,
        board: { create: { name: "test" } },
      },
    });

    await request.get("/posts/1").expect(404);
  });
});

describe("POST /posts", () => {
  test("can create post", async () => {
    await prisma.board.create({ data: { name: "Test" } });
    await request
      .post("/posts")
      .send({ title: "Test", body: "<p>test</p>", board_id: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const posts = await prisma.post.findMany();
    expect(posts.length).toEqual(1);
    expect(posts[0].id).toEqual(1);
    expect(posts[0].body).toEqual("<p>test</p>");
    expect(posts[0].title).toEqual("Test");
  });

  test("cannot create post with empty fields (inc. after sanitisation)", async () => {
    await prisma.board.create({ data: { name: "Test" } });
    await request
      .post("/posts")
      .send({ body: "<p>test</p>", board_id: 1 })
      .expect(400);
    expect(await prisma.post.findFirst()).toEqual(null);

    await request
      .post("/posts")
      .send({ title: "Test", board_id: 1 })
      .expect(400);
    expect(await prisma.post.findFirst()).toEqual(null);

    await request
      .post("/posts")
      .send({ body: "", title: "Test", board_id: 1 })
      .expect(400);
    expect(await prisma.post.findFirst()).toEqual(null);

    await request
      .post("/posts")
      .send({
        body: "<script>window.alert('test');</script>",
        title: "Test",
        board_id: 1,
      })
      .expect(400);
    expect(await prisma.post.findFirst()).toEqual(null);
  });

  test("sanitises input HTML", async () => {
    await prisma.board.create({ data: { name: "Test" } });
    await request
      .post("/posts")
      .send({
        title: "Test <script>window.alert('test')</script>",
        body: "<p>test</p><script>window.alert('test')</script>",
        board_id: 1,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const posts = await prisma.post.findMany();
    expect(posts.length).toEqual(1);
    expect(posts[0].id).toEqual(1);
    expect(posts[0].body).toEqual("<p>test</p>");
    expect(posts[0].title).toEqual("Test ");
  });

  test("strips all HTML from title", async () => {
    await prisma.board.create({ data: { name: "Test" } });
    await request
      .post("/posts")
      .send({
        title: "<strong>Test</strong> title",
        body: "<p>test</p><script>window.alert('test')</script>",
        board_id: 1,
      })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const post = await prisma.post.findFirst();
    expect(post?.title).toEqual("Test title");
  });

  test("requires board to exist", async () => {
    await prisma.board.create({ data: { name: "Test" } });
    await request
      .post("/posts")
      .send({
        title: "Test",
        body: "<p>test</p>",
        board_id: 10,
      })
      .expect(404);

    const posts = await prisma.post.findMany();
    expect(posts.length).toEqual(0);
  });
});

describe("POST /posts/:id/comments", () => {
  test("returns 404 if post does not exist", async () => {
    await request
      .post("/posts/1/comments")
      .send({ body: "<p>test</p>" })
      .expect(404);
  });

  test("saves comment if post does exist", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
      },
    });

    await request
      .post("/posts/1/comments")
      .send({ body: "<p>test</p>" })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const comments = await prisma.comment.findMany();
    expect(comments.length).toEqual(1);
    expect(comments[0].post_id).toEqual(1);
    expect(comments[0].id).toEqual(1);
    expect(comments[0].body).toEqual("<p>test</p>");
    expect(comments[0].parent_comment_id).toEqual(null);
  });

  test("saves reply-comment if post does exist", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>comment</p>" } },
      },
    });

    await request
      .post("/posts/1/comments")
      .send({ body: "<p>test</p>", parentCommentId: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const comments = await prisma.comment.findMany();
    expect(comments.length).toEqual(2);
    expect(comments[1].post_id).toEqual(1);
    expect(comments[1].id).toEqual(2);
    expect(comments[1].body).toEqual("<p>test</p>");
    expect(comments[1].parent_comment_id).toEqual(1);
  });

  test("sanitises input HTML", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
      },
    });

    await request
      .post("/posts/1/comments")
      .send({ body: "<p>test</p><script>window.alert('test');</script>" })
      .expect(200)
      .then((res) => {
        expect(res.body.error).toEqual(false);
        expect(res.body.id).toBeTruthy();
      });

    const comments = await prisma.comment.findMany();
    expect(comments.length).toEqual(1);
    expect(comments[0].body).toEqual("<p>test</p>");
  });
});

describe("POST /posts/:id/flags", () => {
  test("returns 404 if post does not exist", async () => {
    await request.post("/posts/1/flags").send().expect(404);
  });

  test("returns 404 if post is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        deleted: true,
      },
    });

    await request.post("/posts/1/flags").send().expect(404);
  });

  test("can flag non-deleted post", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
      },
    });

    await request.post("/posts/1/flags").send().expect(200);
    expect((await prisma.post.findFirst())?.flags).toEqual(1);
  });
});

describe("POST /comments/:id/flags", () => {
  test("returns 404 if comment does not exist", async () => {
    await request.post("/comments/1/flags").send().expect(404);
  });

  test("returns 404 if comment is deleted", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test</p>", deleted: true } },
      },
    });

    await request.post("/comments/1/flags").send().expect(404);
  });

  test("can flag non-deleted comment", async () => {
    await prisma.post.create({
      data: {
        body: "<p>test</p>",
        title: "Test",
        board: { create: { name: "test" } },
        comments: { create: { body: "<p>test</p>" } },
      },
    });

    await request.post("/comments/1/flags").send().expect(200);
    expect((await prisma.comment.findFirst())?.flags).toEqual(1);
  });
});
