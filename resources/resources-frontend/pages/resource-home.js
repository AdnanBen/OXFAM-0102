import CollapsibleTab from "../components/collapsible-tab/collapsible-tab";
import { useEffect, useState } from "react";
import { fetchAllArticleTitles } from "../api/articles";
import Link from "next/link";
import styles from '../styles/Resource-home.module.css';

function ResourceHome() {
  const categoryTypes = ["violence", "sexual_assault"];
  const [titles, setTitles] = useState([]);

  //get article titles by category.
  useEffect(() => {
    // const data =  await fetchAllArticleTitles();
    const returnVal = {
      articles: [
        {
          _id: "63d93a00ac2c876ed87fd687",
          title: "Signs that you are beign abused.",
          body: "lorem100",
          category: "violence",
        },
        {
          _id: "63d93a00ac2c876ed87fd688",
          title: "Signs that you are being sexually assualted.",
          body: "lorem100- sexual 2",
          category: "sexual_assault",
        },
        {
          _id: "63d93a00ac2c876ed87fd689",
          title: "Signs that you are being sexually assualted.",
          body: "lorem100- sexual",
          category: "sexual_assault",
        },
      ],
    };
    // console.log(data, 'data');
    setTitles(returnVal.articles);
  }, []);

  console.log("titles", titles);

  const collapsibleHeader = (category) => {
    return <div>{category}</div>;
  };

  const collapsibleContent = (category) => {
    const filteredArticles = titles.filter(
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
