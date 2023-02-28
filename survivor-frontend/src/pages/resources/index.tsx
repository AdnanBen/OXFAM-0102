import Link from "next/link";
import styles from "../../styles/Resources.module.css";
import { Article } from "../../articles-interfaces";
import { Message, Panel } from "rsuite";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../server/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const articles = await fetch("http://localhost/api/resources/articles/getall")
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
      <Link href={`/resources/${article._id}`} key={article._id}>
        <div className={styles.articleContainer}>{article.title}</div>
      </Link>
    ));
  };

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Resources</title>
      </Head>

      <main>
        <h2>Resources</h2>
        {categoryTypes ? (
          categoryTypes.map((category: string) => {
            return (
              <Panel
                collapsible
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
            There was an error loading the resources. Please try again later.
          </Message>
        )}
      </main>
    </>
  );
}

export default ResourceHome;
