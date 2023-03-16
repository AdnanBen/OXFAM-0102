import { Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { Message } from "rsuite";
import sanitizeHTML from "sanitize-html";
import { env } from "../../env/env";
import { getServerAuthSession } from "../../server/auth";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/ArticlePage.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const article = await fetch(
    `${env.SSR_HOST}/api/resources/${context.query.resourceId}`
  )
    .then((res) => res.json())
    .then((res) => res.article)
    .catch((err) => {
      console.error("error fetching resource", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      article,
    },
  };
};

export default function ArticlePage({ article }) {
  if (article) {
    return (
      <main>
        <h2 data-testid="article-title">{article.title}</h2>
        <div className={styles.category} data-testid="article-category">
          {article.category}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.body) }}
          data-testid="article-body"
        />
      </main>
    );
  }
  return (
    <main>
      <Message type="error">
        <Trans>
          <div data-testid="no-article">
            There was an error loading the resource. Please try again later.
          </div>
        </Trans>
      </Message>
    </main>
  );
}
