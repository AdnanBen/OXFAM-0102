import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { getServerAuthSession } from "./auth";

export const requireAuth = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  userType: "moderator" | "administrator"
) => {
  const session = await getServerAuthSession(context);
  if (
    (userType === "administrator" && !session?.user?.isAdmin) ||
    (userType === "moderator" &&
      !session?.user?.isAdmin &&
      !session?.user?.isModerator)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { session } };
};
