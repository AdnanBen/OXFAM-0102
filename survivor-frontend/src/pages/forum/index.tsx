import { t, Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Message } from "rsuite";
import { env } from "../../env/env.mjs";
import { getServerAuthSession } from "../../server/auth";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/Forum.module.css";

export type PostType = {
  id: number;
  title: string;
  tag: string;
  created: number; // new Date(number)
};

export const Post = ({ post }: { post: PostType }) => {
  return (
    <Link href={`/forum/${post.id}`} className={styles.post_link} replace>
      <div className={styles.post}>
        <p className={styles.post_id}>{post.id}</p>
        <p className={styles.post_title}>{post.title}</p>
        <p className={styles.post_tag}>{post.tag}</p>
        <p className={styles.post_date}>
          {new Date(post.created).toUTCString()}
        </p>
      </div>
    </Link>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const posts = await fetch(`${env.SSR_HOST}/api/forum/posts`)
    .then((res) => res.json())
    .then((res) => res.posts)
    .catch((err) => {
      console.error("error fetching posts", err);
      return null;
    });

  const boards = await fetch(`${env.SSR_HOST}/api/forum/boards`)
    .then((res) => res.json())
    .then((res) => res.boards)
    .catch((err) => {
      console.error("error fetching boards", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      posts,
      boards,
    },
  };
};

export type BoardType = {
  id: number;
  name: string;
  description: string;
};

type FeedProps = {
  boards: BoardType[];
};

const Feed: NextPage<FeedProps> = ({ boards }) => {
  return (
    <>
      <Head>
        <title>Forum</title>
        <meta name="description" content="Forum" />
      </Head>

      <main>
        <h2>
          <Trans>Forum</Trans>
        </h2>

        <Link href="/forum/new" className={styles.createPostBtn} replace>
          <Button appearance="primary">
            <Trans>Create new post?</Trans>
          </Button>
        </Link>
        <br />
        <h3>
          <Trans>Boards</Trans>
        </h3>
        <text>
          <Trans>
            We have oragnised the posts according to the boards to make it
            easier for you to find support, information and talk to others with
            similar experiences.
          </Trans>
        </text>
        <br />
        <input
          className={styles.board_search}
          type="text"
          placeholder={t`Search...`}
        />
        <br />

        {boards ? (
          <>
            {boards?.map((b) => {
              const boardId = b.id;
              const boardName = b.name;
              return (
                <div>
                  <Link
                    href={`/forum/board?boardId=${boardId}`}
                    className={styles.post_link}
                    replace
                  >
                    <div className={styles.board_button}>{boardName}</div>
                  </Link>
                </div>
              );
            })}
            {!boards?.length && (
              <div>
                <Trans>There are no boards yet.</Trans>
              </div>
            )}
          </>
        ) : (
          <Message type="error">
            <Trans>
              There was an error loading the boards. Please try again later.
            </Trans>
          </Message>
        )}
      </main>
    </>
  );
};

export default Feed;
