import { Trans } from "@lingui/macro";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Panel } from "rsuite";
import PublicOpinionIcon from "@rsuite/icons/PublicOpinion";
import MessageIcon from "@rsuite/icons/Message";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import DetailIcon from "@rsuite/icons/Detail";
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
        <p className={styles.intro} data-testid="home-description">
          <Trans>
            A safe-space for survivors to discuss and share their experiences of
            abuse, and get support.
          </Trans>
        </p>

        <div className={styles.links}>
          <Link href="/forum" className={styles.link} replace data-testId="forum-link">
            <Panel
              header={
                <span className={styles.linkHeader} data-testid="forum-title">
                  <PublicOpinionIcon className={styles.icon} />
                  <Trans>Forum </Trans>
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className={styles.linkText} data-testid="forum-description">
                <Trans>
                  Safely discuss your concerns and receive feedback from the
                  community.
                </Trans>
              </span>
            </Panel>
          </Link>
          <Link href="/chat" className={styles.link} replace data-testId="chat-link">
            <Panel
              header={
                <span className={styles.linkHeader} data-testid="chat-title">
                  <MessageIcon className={styles.icon} />
                  Chat
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className={styles.linkText} data-testid="chat-description">
                <Trans>
                  Chat individually with trained moderators for advice.
                </Trans>
              </span>
            </Panel>
          </Link>
          <Link href="/resources" className={styles.link} replace data-testId="resources-link">
            <Panel
              header={
                <span className={styles.linkHeader} data-testid="resources-title">
                  <DetailIcon className={styles.icon} />
                  Resources
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className={styles.linkText} data-testid="resources-description">
                <Trans>
                  Find free self-help and educational resources to help manage
                  and recover from abuse.
                </Trans>
              </span>
            </Panel>
          </Link>
          <Link href="/report" className={styles.link} replace data-testId="report-link">
            <Panel
              header={
                <span className={styles.linkHeader} data-testid="report-title">
                  <RemindOutlineIcon className={styles.icon} />
                  Report
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className={styles.linkText} data-testid="report-description">
                <Trans>
                  Report severe abuse to receive help from trained responders.
                </Trans>
              </span>
            </Panel>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
