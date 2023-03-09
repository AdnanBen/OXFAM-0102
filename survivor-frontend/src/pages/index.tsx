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
              <Trans>
                Forum <span className="link-text">&rarr;</span> 
              </Trans>
            </span>
            
          }

          bordered
          shaded
          style={{ width: "100%" }}
        >
           <span className="link-text">
            <Trans>
              Safely discuss your concerns and receive feedback from the community.
            </Trans>
          </span>

         </Panel>
        </Link>
        
          
        
          <Link href="/chat">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  Chat <span className="link-text">&rarr;</span>  
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className="link-text">
              <Trans>
                Chat individually with trained moderators for advice.
              </Trans>
              </span>
            </Panel>
          </Link>
          <Link href="/resources">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  Resources <span className="link-text">&rarr;</span> 
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className="link-text">
              <Trans>
                Find free self-help and educational resources to help manage and
                recover from abuse.
              </Trans>
              </span>
            </Panel>
          </Link>
          <Link href="/report">
            <Panel
              header={
                <span className={styles.linkHeader}>
                  Report <span className="link-text">&rarr;</span> 
                </span>
              }
              bordered
              shaded
              style={{ width: "100%" }}
            >
              <span className="link-text">
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
