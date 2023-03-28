import React, { useEffect } from "react";
import { Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { Message } from "rsuite";
import sanitizeHTML from "sanitize-html";
import { getServerAuthSession } from "../../server/auth";
import { fetchJsonApi } from "../../utils/helpers";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/ArticlePage.module.css";
import fetchSSR from "../../server/fetchSSR";

const ARTICLE_VIEW_TIMER_SECONDS = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const article = await fetchSSR(
    `/api/resources/${context.query.resourceId}`
  ).then((res) => res?.article);

  return {
    props: {
      session: await getServerAuthSession(context),
      article,
    },
  };
};

export default function ArticlePage({ article }) {
  const handleView = async () => {
    fetchJsonApi(`/api/resources/${article._id}/view`, {
      method: "POST",
    }).catch((err) => {
      console.log("Failed to record view", err);
    });
  };

  useEffect(() => {
    const timeout = setTimeout(handleView, ARTICLE_VIEW_TIMER_SECONDS * 1000);
    return () => clearTimeout(timeout);
  }, []);

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
