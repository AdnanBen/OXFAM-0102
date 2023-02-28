import { Trans } from "@lingui/macro";
import { type NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community</title>
        <meta name="description" content="Oxfam Survivors Community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className={styles.intro}>
        <Trans>
          A safe-space for survivors to discuss and share their experiences of
          abuse, and get support.
        </Trans>
      </p>
    </>
  );
};

export default Home;
