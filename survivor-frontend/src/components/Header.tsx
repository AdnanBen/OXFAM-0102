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
      <Link href="/">Oxfam Survivors Community</Link>
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
              {pagename}
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
              Moderator
            </Link>
            <a className={styles.authLink} onClick={() => signOut()}>
              Sign out
            </a>
          </>
        ) : (
          <a className={styles.authLink} onClick={() => signIn("azure-ad-b2c")}>
            Login as moderator
          </a>
        )}
      </div>
    </nav>
  );
};

export default Header;
