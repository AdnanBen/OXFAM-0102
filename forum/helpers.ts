export class APIError extends Error {
  status: number;

  constructor(status: number, message: string, ...params) {
    super(...params);
    this.status = status;
    this.name = "APIError";
    this.message = message;
  }
}

export async function requireCaptcha(req) {
  if (!req.body.validated && process.env.NODE_ENV === "production") {
    const endpoint =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const secret = process.env.CLOUDFLARE_SECRET;

    const resp = await fetch(endpoint, {
      method: "POST",
      body: `secret=${encodeURIComponent(
        secret!
      )}&response=${encodeURIComponent(req.body.cftoken)}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const data = await resp.json();
    console.log(req.body.cftoken);
    console.log(resp);
    console.log(data);
    if (!data.success) {
      throw new APIError(401, "Captcha verification failed");
    }

    return true;
  }
  return true;
}
