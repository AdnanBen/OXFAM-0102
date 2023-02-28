import { GetServerSideProps } from "next";
import { Message } from "rsuite";
import sanitizeHTML from "sanitize-html";
import { getServerAuthSession } from "../../server/auth";
import styles from "../../styles/ArticlePage.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const article = await fetch(
    `http://localhost/api/resources/articles/get/${context.query.resourceId}`
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
  return article ? (
    <div className={styles.articleContainer}>
      <div className={styles.articleTitle}>{article.title}</div>
      <div>{article.category}</div>
      <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.body) }} />
    </div>
  ) : (
    <Message type="error">
      There was an error loading the resource. Please try again later
    </Message>
  );
}
