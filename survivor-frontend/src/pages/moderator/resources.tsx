import Link from "next/link";
import { useEffect, useState } from "react";

import Head from "next/head";
import { Button, Panel } from "rsuite";
import { Article } from "../../articles-interfaces";

import { GetServerSideProps } from "next";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ModeratorResources.module.css";
import { fetchJsonApi } from "../../utils/helpers";
import { env } from "../../env/env.mjs";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

function AdminDashboard() {
  const [values, setValues] = useState({
    error: "",
    articles: [],
  });

  const loadAllArticleTitles = () => {
    fetchJsonApi(`${env.SSR_HOST}/resources/titles`)
      .then((res) => {
        setValues({
          ...values,
          articles: res.articles,
        });
      })
      .catch((err) => {
        console.log(err);
        setValues({ ...values, error: err });
      });
  };

  const deleteArticle = (id: string) => {
    fetchJsonApi(`${env.SSR_HOST}/resources/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => loadAllArticleTitles())
      .catch((err) => {
        setValues({ ...values, error: err });
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
                      replace
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

        <Link href={`/moderator/article-submission-form`} replace>
          <Button appearance="ghost">Add new resource?</Button>
        </Link>
      </main>
    </>
  );
}

export default AdminDashboard;
