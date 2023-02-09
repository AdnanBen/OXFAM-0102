import CollapsibleTab from "../../components/CollapsibleTab";
import { useEffect, useState } from "react";
import { fetchAllArticleTitles } from "../../articles-helpers";
import Link from "next/link";
import styles from "../../styles/Resources.module.css";
import { Article } from "../../articles-interfaces";

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
