import React, { useEffect, useState } from "react";
import { fetchAllArticleTitles, deleteArticleById } from "../api/articles";
import Link from "next/link";

import Router from "next/router";
import { Article } from "../interfaces";

function AdminDashboard() {
  const [values, setValues] = useState({
    error: "",
    articles: [],
  });
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

  const deleteArticle = (id: string) => {
    deleteArticleById(id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log("article deleted");
        Router.reload();
      }
    });
  };

  useEffect(() => {
    loadAllArticleTitles();
  }, []);

  return (
    <div>
      <Link href={`/article-submission-form`}>
        <div>Add New Article</div>
      </Link>
      {values.articles.map((article: Article) => {
        return (
          <>
            <div>
              <Link
                href={`/article-update-form?articleId=${article._id}`}
                key={article._id}
              >
                <div>{article.title}</div>
              </Link>
              <button onClick={() => deleteArticle(article._id)}>Delete</button>
            </div>
          </>
        );
      })}
    </div>
  );
}

export default AdminDashboard;
