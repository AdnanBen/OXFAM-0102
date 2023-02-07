import { type NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Oxfam Survivor's Community</title>
        <meta name="description" content="Oxfam Survivor's Community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className={styles.intro}>
        A safe-space for survivors to discuss and share their experiences of
        abuse, and get support.
      </p>
    </>
  );
};

export default Home;
