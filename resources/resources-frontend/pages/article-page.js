import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Article-page.module.css";

export default function ArticlePage() {
  const router = useRouter();
  // console.log("router", router.query);

  const [data, setData] = useState();
  useEffect(() => {
    // const data = await fetchArticleById(router.query.articleId);
    const returnVal = {
      article: {
        _id: "63d93a00ac2c876ed87fd687",
        title: "Signs that you are beign abused.",
        body: "lorem100",
        category: "violence",
      },
    };
    // console.log(data, 'data');
    setData(returnVal.article);
  }, []);
  return (
    <>
      <div className={styles.articleContainer}>
        <div className={styles.articleTitle}>{data?.title}</div>
        <div>{data?.category}</div>
        <div>{data?.body}</div>
      </div>
    </>
  );
}
