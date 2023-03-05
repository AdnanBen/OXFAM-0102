import { describe, test, expect } from "@jest/globals";
import supertest from "supertest";
import prisma from "../db";
import { app } from "../index";

const request = supertest(app);
describe("GET /boards", () => {
  test("returns no boards when none exist", async () => {
    await request
      .get("/boards")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, boards: [] });
      });
  });

  test("returns boards when they do exist", async () => {
    await prisma.board.create({ data: { name: "Board" } });
    await request
      .get("/boards")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          boards: [{ id: 1, name: "Board", description: null }],
        });
      });
  });
});

describe("GET /tags", () => {
  test("returns no tags when none exist", async () => {
    await request
      .get("/tags")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, tags: [] });
      });
  });

  test("returns tags when they do exist", async () => {
    await prisma.tag.create({ data: { name: "Tag" } });
    await request
      .get("/tags")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          tags: [{ name: "Tag", description: null }],
        });
      });
  });
});
