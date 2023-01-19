import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    res.send({
      content: "Welcome to the moderator dashboard",
    });
  } else {
    res.send({
      error: "You need to be signed in.",
    });
  }
};