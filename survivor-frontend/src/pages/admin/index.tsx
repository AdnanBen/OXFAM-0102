import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, Panel } from "rsuite";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ModeratorDashboard.module.css";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "administrator");

const AdminDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Oxfam Survivors Community | Administators</title>
      </Head>

      <main>
        <h2>Administrator Dashboard</h2>
        <div className={styles.callToActions}>
          <Panel header="Trends" bordered className={styles.group} shaded>
            <p>View trends regarding the platform's usage.</p>
            <Link href="/admin/trends">
              <Button appearance="ghost">View trends &rarr;</Button>
            </Link>
          </Panel>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
