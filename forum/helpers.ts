import { Db } from "mongodb";

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string, ...params) {
    super(...params);
    this.status = status;
    this.name = "APIError";
    this.message = message;
  }
}
