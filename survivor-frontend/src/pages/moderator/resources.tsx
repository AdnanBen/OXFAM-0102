import Link from "next/link";
import { useEffect, useState } from "react";

import Head from "next/head";
import { Button, Panel } from "rsuite";
import { Article } from "../../articles-interfaces";

import { GetServerSideProps } from "next";
import { requireAuth } from "../../server/requireAuth";
import styles from "../../styles/ModeratorResources.module.css";
import { fetchJsonApi } from "../../utils/helpers";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

function AdminDashboard() {
  const router = useRouter();
  const [values, setValues] = useState({
    error: "",
    articles: [],
  });

  const loadAllArticles = () => {
    fetchJsonApi(`/api/resources`)
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
    fetchJsonApi(`/api/moderators/resources/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => loadAllArticles())
      .catch((err) => {
        setValues({ ...values, error: err });
      });
  };

  useEffect(() => {
    loadAllArticles();
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
                <p
                  className={styles.resourceBodyPreview}
                  dangerouslySetInnerHTML={{ __html: article.body }}
                />

                <div className={styles.resourceActions}>
                  <Button
                    size="sm"
                    appearance="ghost"
                    onClick={() =>
                      router.push(
                        `/moderator/article-update-form?articleId=${article._id}`
                      )
                    }
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
