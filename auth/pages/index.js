import Head from "next/head";
import styles from "../styles/Home.module.css";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession()
  return (
    <div className={styles.container}>
      <Head>
        <title>Authentication</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {status === "unauthenticated" && (
          <>
            Not signed in <br />
            <button onClick={signIn}>Sign In</button>
          </>
        )}
        {status === "authenticated" && (
          <>
            Signed in as {session.user.email} <br />
            <div>You can now access the moderator dashboard</div>
            <button>
              <Link href="/dashboard">To the secret</Link>
            </button>
            <button onClick={signOut}>Sign Out</button>
          </>
        )}
      </main>
    </div>
  );
}