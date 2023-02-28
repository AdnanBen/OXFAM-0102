import { t, Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../server/auth";
import styles from "../styles/Header.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getServerAuthSession(context),
    },
  };
};

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className={styles.header}>
      <Link href="/">
        <Trans>Oxfam Survivors Community</Trans>
      </Link>
      <div className={styles.links}>
        {["Forum", "Chat", "Resources", "Report"].map((pagename) => {
          const pathname = `/${pagename.toLowerCase()}`;
          return (
            <Link
              href={pathname}
              className={
                router.pathname.startsWith(pathname) ? styles.active : ""
              }
            >
              {t`${pagename}`}
            </Link>
          );
        })}
        {session ? (
          <>
            <Link
              href="/moderator"
              className={
                router.pathname.startsWith("/moderator") ? styles.active : ""
              }
            >
              <Trans>Moderator</Trans>
            </Link>
            <a className={styles.authLink} onClick={() => signOut()}>
              <Trans>Sign out</Trans>
            </a>
          </>
        ) : (
          <a className={styles.authLink} onClick={() => signIn("azure-ad-b2c")}>
            <Trans>Login as moderator</Trans>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Header;
