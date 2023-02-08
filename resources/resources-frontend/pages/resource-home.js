import CollapsibleTab from "../components/collapsible-tab/collapsible-tab";
import { useEffect, useState } from "react";
import { fetchAllArticleTitles } from "../api/articles";
import Link from "next/link";
import styles from "../styles/Resource-home.module.css";

function ResourceHome() {
  const categoryTypes = ["violence", "sexual_assault"];
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

  const collapsibleHeader = (category) => {
    return <div>{category}</div>;
  };

  const collapsibleContent = (category) => {
    const filteredArticles = values?.articles?.filter(
      (article) => article.category === category
    );
    console.log("filteredArticles", filteredArticles);
    return filteredArticles.map((article) => {
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
      {categoryTypes.map((category) => {
        return (
          <CollapsibleTab
            headerComponent={collapsibleHeader(category)}
            contentComponent={collapsibleContent(category)}
          ></CollapsibleTab>
        );
      })}
    </>
  );
  return <h1>First Post</h1>;
}

export default ResourceHome;
