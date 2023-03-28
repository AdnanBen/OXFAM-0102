import { Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, Message } from "rsuite";
import { getServerAuthSession } from "../../server/auth";
import fetchSSR from "../../server/fetchSSR";
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
    <Link
      href={`/forum/${post.id}`}
      className={styles.post_link}
      replace
      data-testid="post-link"
    >
      <div className={styles.post}>
        <p className={styles.post_id}>{post.id}</p>
        <p className={styles.post_title} data-testid="post-title">
          {post.title}
        </p>
        <p className={styles.post_tag} data-testid="post-tag">
          {post.tag}
        </p>
        <p className={styles.post_date} data-testid="post-date">
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

  const posts = await fetchSSR(`/api/forum/posts`).then((res) => res.posts);
  const boards = await fetchSSR(`/api/forum/boards`).then((res) => res.boards);

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

          <Link
            href="/forum/new"
            className={styles.createPostBtn}
            replace
            data-testid="forum-create-link"
          >
            <Button appearance="primary" size="sm">
              <Trans>Create new post?</Trans>
            </Button>
          </Link>
        </h2>

        <Trans>
          Please select a category to find support and talk to others with
          similar experiences.
        </Trans>

        {boards ? (
          <>
            {boards?.map((b) => {
              return (
                <Link
                  href={`/forum/board?boardId=${b.id}`}
                  replace
                  className={styles.board_wrapper}
                  data-testid="forum-boards-link"
                >
                  <div>
                    <div className={styles.board_button}>{b.name}</div>
                    <p>{b.description}</p>
                  </div>
                  <span className={styles.arrow}>⮞</span>
                </Link>
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
