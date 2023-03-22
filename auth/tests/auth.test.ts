import { describe, expect, test, beforeEach, jest } from "@jest/globals";
import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../src/app";
import PendingRegistration from "../src/models/PendingRegistration";

const request = supertest(app);
describe("POST /pendingRegistrations", () => {
  const ORIGINAL_ENV = {...process.env};
  beforeEach(() => {
    jest.resetModules();
    process.env = {...ORIGINAL_ENV};
  });

  test("requires authorization header", async () => {
    await request
      .post("/pendingRegistrations")
      .expect(401)
  });

  test("requires correct authorization", async () => {
    process.env.AZURE_API_CONNECTOR_USERNAME = 'user';
    process.env.AZURE_API_CONNECTOR_PASSWORD = 'pass';

    await request
      .post("/pendingRegistrations")
      .set('Authorization', `Basic ${Buffer.from('foo:bar').toString('base64')}`)
      .expect(401)
  });

  test("saves the provided body when authorised", async () => {
    process.env.AZURE_API_CONNECTOR_USERNAME = 'user';
    process.env.AZURE_API_CONNECTOR_PASSWORD = 'pass';

    await request
      .post("/pendingRegistrations")
      .set('Authorization', `Basic ${Buffer.from('user:pass').toString('base64')}`)
      .send({email: "foo@bar.com"})
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          version: "1.0.0",
          action: "ShowBlockPage",
          userMessage:
            "Your account is now pending approval. You'll be notified when your request has been approved.",
        });
      });

    const pendingRegistrations = await PendingRegistration.find();
    expect(pendingRegistrations.length).toEqual(1);
    expect(articles[0].email).toEqual("foo@bar.com");
    expect(articles[0].token).toBeTruthy();
  });

  test("requires email in body", async () => {
    process.env.AZURE_API_CONNECTOR_USERNAME = 'user';
    process.env.AZURE_API_CONNECTOR_PASSWORD = 'pass';

    await request
      .post("/pendingRegistrations")
      .set('Authorization', `Basic ${Buffer.from('user:pass').toString('base64')}`)
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          version: "1.0.0",
          action: "ShowBlockPage",
          userMessage:
            "There was an unexpected error registering your account. Please try again later or contact the administator if the issue persists.",
        });
      });

    const pendingRegistrations = await PendingRegistration.find();
    expect(pendingRegistrations.length).toEqual(0);
  });
});

describe("POST /pendingRegistrations/approve", () => {
  test("requires valid token in URL", async () => {
    await request
      .post("/pendingRegistrations/approve/foo")
      .expect(404)
  });

  test("requires valid token in URL", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: 'foo' }),
      })
    );
    global.fetch = mockFetch;

    const id = new mongoose.Types.ObjectId();
    await PendingRegistration.create({
      _id: id,
      email: "foo@bar.com"
    });

    await request
      .post("/pendingRegistrations/approve/foo")
      .expect(200)

    const pendingRegistrations = await PendingRegistration.find();
    expect(pendingRegistrations.length).toEqual(0);
  });
});
