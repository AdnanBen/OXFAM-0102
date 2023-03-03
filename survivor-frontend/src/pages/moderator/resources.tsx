import React, { useEffect, useState } from "react";
import {
  fetchAllArticleTitles,
  deleteArticleById,
} from "../../articles-helpers";
import Link from "next/link";

import Router from "next/router";
import { Article } from "../../articles-interfaces";
import { Button, Panel } from "rsuite";
import Head from "next/head";

import styles from "../../styles/ModeratorResources.module.css";
import { requireAuth } from "../../server/requireAuth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

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
    <>
      <Head>
        <title>Oxfam Survivors Community | Moderators | Resources</title>
      </Head>

      <main>
        <h2>Moderator Dashboard: Resources</h2>

        <div className={styles.resources}>
          {values.articles.map((article: Article) => {
            return (
              <Panel
                header={
                  <strong>
                    <Link
                      href={`/moderator/article-update-form?articleId=${article._id}`}
                      key={article._id}
                    >
                      {article.title}
                    </Link>
                  </strong>
                }
                bordered
                shaded
              >
                <p>Category: {article.category}</p>
                <p className={styles.resourceBodyPreview}>
                  Body: {article.body}
                </p>

                <div className={styles.resourceActions}>
                  <Button
                    size="sm"
                    appearance="ghost"
                    onClick={() => deleteArticle(article._id)}
                  >
                    Edit?
                  </Button>

                  <Button
                    size="sm"
                    appearance="ghost"
                    color="red"
                    onClick={() => deleteArticle(article._id)}
                  >
                    Delete?
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>

        <Link href={`/moderator/article-submission-form`}>
          <Button appearance="ghost">Add new resource?</Button>
        </Link>
      </main>
    </>
  );
}

export default AdminDashboard;
