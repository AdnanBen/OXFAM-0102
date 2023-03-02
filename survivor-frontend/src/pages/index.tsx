import { Trans } from "@lingui/macro";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Panel } from "rsuite";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community</title>
        <meta name="description" content="Oxfam Survivors Community" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <p className={styles.intro}>
          <Trans>
            A safe-space for survivors to discuss and share their experiences of
            abuse, and get support.
          </Trans>
        </p>

        <div className={styles.links}>
          <Link href="/forum">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  <Trans>Forum</Trans> &rarr;
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <Trans>
                Safely discuss your concerns and receive feedback from the
                community.
              </Trans>
            </Panel>
          </Link>
          <Link href="/chat">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  <Trans>Chat</Trans> &rarr;
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <Trans>
                Chat individually with trained moderators for advice.
              </Trans>
            </Panel>
          </Link>
          <Link href="/resources">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  <Trans>Resources</Trans> &rarr;
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <Trans>
                Find free self-help and educational resources to help manage and
                recover from abuse.
              </Trans>
            </Panel>
          </Link>
          <Link href="/report">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  <Trans>Report</Trans> &rarr;
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <Trans>
                Report severe abuse to receive help from trained responders.
              </Trans>
            </Panel>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
