import { Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Message, Panel } from "rsuite";
import { Article } from "../../articles-interfaces";
import { env } from "../../env/env.mjs";
import { getServerAuthSession } from "../../server/auth";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/Resources.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const articles = await fetch(`${env.SSR_HOST}/api/resources/articles/getall`)
    .then((res) => res.json())
    .then((res) => res.articles)
    .catch((err) => {
      console.error("error fetching resources", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      articles,
    },
  };
};

function ResourceHome({ articles }) {
  const categoryTypes: string[] = articles?.map((a: any) => a.category);

  const collapsibleContent = (category: string) => {
    const filteredArticles = articles.filter(
      (article: Article) => article.category === category
    );

    return filteredArticles.map((article: Article) => (
      <Link href={`/resources/${article._id}`} key={article._id} replace>
        <div className={styles.articleAnchor}>{article.title}</div>
      </Link>
    ));
  };

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Resources</title>
      </Head>

      <main>
        <h2>
          <Trans>Resources</Trans>
        </h2>
        {categoryTypes ? (
          categoryTypes.map((category: string) => {
            return (
              <Panel
                collapsible
                defaultExpanded
                header={<div className={styles.header}>{category}</div>}
                bordered
                className={styles.resourceCategory}
              >
                {collapsibleContent(category)}
              </Panel>
            );
          })
        ) : (
          <Message type="error">
            <Trans>
              There was an error loading the resources. Please try again later.
            </Trans>
          </Message>
        )}
      </main>
    </>
  );
}

export default ResourceHome;
