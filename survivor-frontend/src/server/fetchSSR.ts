import { env } from "../env/env.mjs";

export default async function fetchSSR(
  path: string,
  options: RequestInit = { method: "GET" }
) {
  if (!options.headers) options.headers = {};
  options.headers["X-SSR-KEY"] = env.SSR_SECRET_KEY;

  return fetch(`${env.SSR_HOST}${path}`, options)
    .then((res) => res.json())
    .catch((err) => {
      console.error("error fetching SSR", path, err);
      return null;
    });
}
