import { describe, expect, test } from "@jest/globals";
import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../src/app";
import Article from "../src/models/Article";

const request = supertest(app);
describe("GET /articles", () => {
  test("returns no articles when none exist", async () => {
    await request
      .get("/articles/getall")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, articles: [] });
      });
  });

  test("returns articles when they do exist", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request
      .get("/articles/getall")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          articles: [
            {
              _id: id.toString(),
              title: "Test",
              body: "Test",
              category: "Test",
            },
          ],
        });
      });
  });

  test("returns no article titles when none exist", async () => {
    await request
      .get("/articles/getalltitles")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, articles: [] });
      });
  });

  test("returns article titles when they do exist", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request
      .get("/articles/getalltitles")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          articles: [
            {
              _id: id.toString(),
              title: "Test",
              category: "Test",
            },
          ],
        });
      });
  });

  test("returns no articles by category when none exist", async () => {
    await request
      .get("/articles/getbycategory?category=Test")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, articles: [] });
      });
  });

  test("returns articles by category when they do exist", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request
      .get("/articles/getbycategory?category=Test")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          articles: [
            {
              _id: id.toString(),
              title: "Test",
              body: "Test",
              category: "Test",
            },
          ],
        });
      });
  });
});

describe("GET /articles/:id", () => {
  test("rejects invalid IDs", async () => {
    await request.get("/articles/get/1").expect(400);
  });

  test("returns 404 when article does not exist", async () => {
    await request
      .get(`/articles/get/${new mongoose.Types.ObjectId()}`)
      .expect(404);
  });

  test("returns article when it exists", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request
      .get(`/articles/get/${id.toString()}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          article: {
            _id: id.toString(),
            title: "Test",
            body: "Test",
            category: "Test",
          },
        });
      });
  });
});

describe("POST /articles", () => {
  test("rejects empty fields", async () => {
    await request.post("/articles/create").expect(400);
    await request
      .post("/articles/create")
      .send({
        title: "Test",
        body: "Test",
        category: "",
      })
      .expect(400);
    await request
      .post("/articles/create")
      .send({
        title: "Test",
        category: "Test",
      })
      .expect(400);
  });

  test("creates valid article", async () => {
    await request
      .post("/articles/create")
      .send({
        title: "Test",
        body: "Test",
        category: "Test",
      })
      .expect(201);

    const articles = await Article.find();
    expect(articles.length).toEqual(1);
    expect(articles[0].title).toEqual("Test");
    expect(articles[0].body).toEqual("Test");
    expect(articles[0].category).toEqual("Test");
  });
});

describe("PATCH /articles/:id", () => {
  test("rejects invalid IDs", async () => {
    await request.patch("/articles/update/1").expect(400);
  });

  test("returns 404 when article does not exist", async () => {
    await request
      .patch(`/articles/update/${new mongoose.Types.ObjectId()}`)
      .expect(404);
  });

  test("updates partial fields", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request
      .patch(`/articles/update/${id}`)
      .send({
        title: "Test Updated",
      })
      .expect(200);

    const article = await Article.findById(id);
    expect(article!.title).toEqual("Test Updated");
    expect(article!.body).toEqual("Test");
    expect(article!.category).toEqual("Test");
  });
});

describe("DELETE /articles/:id", () => {
  test("rejects invalid IDs", async () => {
    await request.delete("/articles/delete/1").expect(400);
  });

  test("returns 404 when article does not exist", async () => {
    await request
      .delete(`/articles/delete/${new mongoose.Types.ObjectId()}`)
      .expect(404);
  });

  test("deletes existing article", async () => {
    const id = new mongoose.Types.ObjectId();
    await Article.create({
      _id: id,
      title: "Test",
      body: "Test",
      category: "Test",
    });

    await request.delete(`/articles/delete/${id}`).expect(200);
    const article = await Article.findById(id);
    expect(article).toBeNull();
  });
});
