import "bootstrap/dist/css/bootstrap.min.css";
import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "rsuite";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { api } from "../utils/api";
import styles from "../styles/App.module.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale, pathname, replace: replacePath } = useRouter();

  useEffect(() => {
    const activeLocale = locale ?? "en";
    import(`../locales/${activeLocale}/messages`)
      .then((messages) => i18n.load(activeLocale, messages.messages))
      .then(() => i18n.activate(activeLocale));
  }, [locale]);

  const handleBack = () => {
    const pathParts = pathname.split("/");
    delete pathParts[pathParts.length - 1];
    replacePath(`/${pathParts.join("")}`);
  };

  return (
    <SessionProvider session={session}>
      <I18nProvider i18n={i18n}>
        <div className={styles.container}>
          <Link href="/l.html" className={styles.panicButton}>
            Exit site quickly
          </Link>
          <Header />

          {pathname !== "/" && (
            <Button
              appearance="ghost"
              size="xs"
              className={styles.backButton}
              onClick={handleBack}
            >
              ⮪ Back
            </Button>
          )}

          <Component {...pageProps} />
          <Footer />
        </div>
      </I18nProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
