import { useEffect, useState } from "react";
import { fetchAllArticleTitles } from "../../articles-helpers";
import Link from "next/link";
import styles from "../../styles/Resources.module.css";
import { Article } from "../../articles-interfaces";
import { Panel } from "rsuite";
import Head from "next/head";

function ResourceHome() {
  const categoryTypes: string[] = ["violence", "sexual_assault"];
  const [values, setValues] = useState({
    error: "",
    articles: [],
  });

  //get article titles by category.

  const loadAllArticleTitles = () => {
    fetchAllArticleTitles().then((data) => {
      console.log("data", data.articles);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          articles: data.articles,
        });
      }
    });
  };

  console.log("values.articles", values.articles);

  const collapsibleHeader = (category: string) => {
    return <div>{category}</div>;
  };

  const collapsibleContent = (category: string) => {
    const filteredArticles = values?.articles?.filter(
      (article: Article) => article.category === category
    );
    console.log("filteredArticles", filteredArticles);
    return filteredArticles.map((article: Article) => {
      return (
        <Link href={`/resources/${article._id}`} key={article._id}>
          <div className={styles.articleContainer}>{article.title}</div>
        </Link>
      );
    });
  };

  useEffect(() => {
    loadAllArticleTitles();
  }, []);

  return (
    <>
      <Head>
        <title>OXFAM Survivors Community | Resources</title>
      </Head>

      <main>
        <h2>Resources</h2>
        {categoryTypes.map((category: string) => {
          return (
            <Panel
              collapsible
              header={collapsibleHeader(category)}
              bordered
              className={styles.resourceCategory}
            >
              {collapsibleContent(category)}
            </Panel>
          );
        })}
      </main>
    </>
  );
}

export default ResourceHome;
