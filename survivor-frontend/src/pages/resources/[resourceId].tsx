import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/ArticlePage.module.css";
import { fetchArticleById } from "../../articles-helpers";
import { Article } from "../../articles-interfaces";

export default function ArticlePage() {
  const router = useRouter();
  console.log("router.query.articleId", router.query.resourceId);

  const [values, setValues] = useState({
    error: "",
    article: {} as Article,
  });

  const { error, article } = values;

  const loadArticleById = (id: string) => {
    fetchArticleById(id).then((data) => {
      console.log("data", data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          article: data.article,
        });
      }
    });
  };

  useEffect(() => {
    const id = Array.isArray(router.query.resourceId)
      ? router.query.resourceId[0]
      : router.query.resourceId;
    loadArticleById(id);
  }, []);

  return (
    <>
      <div className={styles.articleContainer}>
        <div className={styles.articleTitle}>{article.title}</div>
        <div>{article.category}</div>
        <div>{article.body}</div>
      </div>
    </>
  );
}