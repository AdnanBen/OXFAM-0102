import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Button } from "rsuite";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community | Login</title>
        <meta name="description" content="Oxfam Survivors Community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Button
          appearance="ghost"
          style={{ margin: "auto", display: "block" }}
          onClick={() => signIn("azure-ad-b2c")}
        >
          Login as moderator/administrator
        </Button>
      </main>
    </>
  );
};

export default Home;
