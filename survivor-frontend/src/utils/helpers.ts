export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const fetchJsonApi = (
  url: string,
  options: RequestInit
): Promise<Response> =>
  fetch(url, options)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to perform request");
      return res;
    })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw new Error("Failed to perform request");
      return res;
    });
