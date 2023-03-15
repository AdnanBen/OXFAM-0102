import { describe, expect, test } from "@jest/globals";
import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../src/app";
import Report from "../src/models/Report";

const request = supertest(app);
describe("GET /reports/completereports", () => {
  test("returns no reports when none exist", async () => {
    await request
      .get("/reports/completereports/getall")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ error: false, reports: [] });
      });
  });

  test("returns reports when they do exist", async () => {
    const id = new mongoose.Types.ObjectId();
    await Report.create({
      _id: id,
      name: "Test",
      situation: "Test",
    });

    await request
      .get("/reports/completereports/getall")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          reports: [
            {
              _id: id.toString(),
              name: "Test",
              situation: "Test",
            },
          ],
        });
      });
  });
});

describe("GET /reports/completereports/:id", () => {
  test("rejects invalid IDs", async () => {
    await request.get("/reports/completereports/get/1").expect(400);
  });

  test("returns 404 when report does not exist", async () => {
    await request
      .get(`/reports/completereports/get/${new mongoose.Types.ObjectId()}`)
      .expect(404);
  });

  test("returns report when it exists", async () => {
    const id = new mongoose.Types.ObjectId();
    await Report.create({
      _id: id,
      name: "Test",
      situation: "Test",
    });

    await request
      .get(`/reports/completereports/get/${id.toString()}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          error: false,
          report: {
            _id: id.toString(),
            name: "Test",
            situation: "Test",
          },
        });
      });
  });
});

describe("POST /reports/completereports", () => {
  test("rejects empty fields", async () => {
    await request.post("/reports/completereports/create").expect(400);
    await request
      .post("/reports/completereports/create")
      .send({
        name: "Test",
        situation: "",
      })
      .expect(400);
    await request
      .post("/reports/completereports/create")
      .send({
        name: "Test",
      })
      .expect(400);
  });

  test("creates valid report", async () => {
    await request
      .post("/reports/completereports/create")
      .send({
        name: "Test",
        situation: "Test",
      })
      .expect(201);

    const reports = await Report.find();
    expect(reports.length).toEqual(1);
    expect(reports[0].name).toEqual("Test");
    expect(reports[0].situation).toEqual("Test");
  });
});

describe("DELETE /reports/completereports/:id", () => {
  test("rejects invalid IDs", async () => {
    await request.delete("/reports/completereports/delete/1").expect(400);
  });

  test("returns 404 when report does not exist", async () => {
    await request
      .delete(
        `/reports/completereports/delete/${new mongoose.Types.ObjectId()}`
      )
      .expect(404);
  });

  test("deletes existing report", async () => {
    const id = new mongoose.Types.ObjectId();
    await Report.create({
      _id: id,
      name: "Test",
      situation: "Test",
    });

    await request.delete(`/reports/completereports/delete/${id}`).expect(200);
    const report = await Report.findById(id);
    expect(report).toBeNull();
  });
});
