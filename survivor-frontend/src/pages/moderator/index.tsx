import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, Panel } from "rsuite";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ModeratorDashboard.module.css";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

const ModeratorDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community | Moderators</title>
      </Head>

      <main>
        <h2>Moderator Dashboard</h2>
        <div className={styles.callToActions}>
          <Panel header="Resources" bordered className={styles.group} shaded>
            <p>Manage resources available to survivors.</p>
            <Link href="/moderator/article-submission-form">
              <Button appearance="ghost">Create new resource &rarr;</Button>
            </Link>
            <Link href="/moderator/resources">
              <Button appearance="ghost">View resources &rarr;</Button>
            </Link>
          </Panel>

          <Panel header="Chat" bordered className={styles.group} shaded>
            <p>
              Provide live, one-to-one, confidential support with survivors.
            </p>
            <Link href="/moderator/chat">
              <Button appearance="ghost">Chat with survivors &rarr;</Button>
            </Link>
          </Panel>

          <Panel header="Reports" bordered className={styles.group} shaded>
            <p>Manage reports submitted by survivors.</p>
            <Link href="/moderator/reports">
              <Button appearance="ghost">View reports &rarr;</Button>
            </Link>
          </Panel>
        </div>
      </main>
    </>
  );
};

export default ModeratorDashboard;
