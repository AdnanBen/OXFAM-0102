import { t, Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "rsuite";
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
  <Link
    href={props.pathname}
    className={`${styles.link} ${props.active ? styles.active : ""}`}
    replace
  >
    {props.text}
  </Link>
);

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleBack = () => {
    const pathParts = router.pathname.split("/");
    delete pathParts[pathParts.length - 1];
    router.replace(`/${pathParts.join("")}`);
  };

  return (
    <nav className={styles.header}>
      <div className={styles.nav}>
        <Link href="/" className={styles.name} replace>
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

          {!!session && (
            <>
              <Link
                href="/moderator"
                className={
                  router.pathname.startsWith("/moderator") ? styles.active : ""
                }
                replace
              >
                <Trans>Moderator</Trans>
              </Link>
              <a className={styles.authLink} onClick={() => signOut()}>
                <Trans>Sign out</Trans>
              </a>
            </>
          )}
        </div>
      </div>

      {router.pathname !== "/" && (
        <Button
          appearance="ghost"
          size="xs"
          className={styles.backButton}
          onClick={handleBack}
        >
          ⮪ Back
        </Button>
      )}
    </nav>
  );
};

export default Header;
