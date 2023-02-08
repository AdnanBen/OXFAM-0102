import CollapsibleTab from "../components/collapsible-tab/collapsible-tab";
import { useEffect, useState } from "react";
import { fetchAllArticleTitles } from "../api/articles";
import Link from "next/link";
import styles from "../styles/Resource-home.module.css";
import { Article } from "../interfaces";

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

  const collapsibleContent = (category: string ) => {
    const filteredArticles = values?.articles?.filter(
      (article: Article) => article.category === category
    );
    console.log("filteredArticles", filteredArticles);
    return filteredArticles.map((article: Article) => {
      return (
        <Link href={`/article-page?articleId=${article._id}`} key={article._id}>
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
      <div className={styles.resourceTitle}>Resources</div>
      {categoryTypes.map((category: string) => {
        return (
          <CollapsibleTab
            headerComponent={collapsibleHeader(category)}
            contentComponent={collapsibleContent(category)}
          ></CollapsibleTab>
        );
      })}
    </>
  );
}

export default ResourceHome;
