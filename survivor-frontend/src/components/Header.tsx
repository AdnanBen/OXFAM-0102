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

const HeaderLink = (props: {
  text: string;
  pathname: string;
  active: boolean;
}) => (
  <Link href={props.pathname} className={props.active ? styles.active : ""}>
    {props.text}
  </Link>
);

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.name}>
        <Trans>Oxfam Survivors Community</Trans>
      </Link>
      <div className={styles.links}>
        <HeaderLink
          text={t`Forum`}
          pathname="/forum"
          active={router.pathname.startsWith("/forum")}
        />
        <HeaderLink
          text={t`Chat`}
          pathname="/chat"
          active={router.pathname.startsWith("/chat")}
        />
        <HeaderLink
          text={t`Resources`}
          pathname="/resources"
          active={router.pathname.startsWith("/resources")}
        />
        <HeaderLink
          text={t`Report`}
          pathname="/report"
          active={router.pathname.startsWith("/report")}
        />

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
