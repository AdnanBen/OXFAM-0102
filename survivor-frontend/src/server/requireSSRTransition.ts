import { GetServerSidePropsContext, PreviewData, Redirect } from "next";
import { ParsedUrlQuery } from "querystring";
import { env } from "../env/env.mjs";

export default (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
): { redirect: Redirect } | null => {
  if (
    !context.req.url?.startsWith("/_next") &&
    env.NODE_ENV !== "development"
  ) {
    return {
      redirect: {
        destination: env.NEXT_PUBLIC_PANIC_URL_PATH,
        permanent: false,
      },
    };
  }
  return null;
};
