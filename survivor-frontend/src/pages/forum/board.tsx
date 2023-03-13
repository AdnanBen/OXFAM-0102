import { Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import Link from "next/link";
import { Message } from "rsuite";
import { env } from "../../env/env.mjs";
import requireSSRTransition from "../../server/requireSSRTransition";
import { Post, PostType } from "./index";
import styles from "../../styles/Forum.module.css";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const boards = await fetch(`${env.SSR_HOST}/api/forum/boards`)
    .then((res) => res.json())
    .then((res) => res.boards)
    .catch((err) => {
      console.error("error fetching boards", err);
      return null;
    });

  const board = boards.find((b: any) => b.id === +context.query.boardId!);

  if (!board) return { notFound: true };

  const posts = await fetch(
    `${env.SSR_HOST}/api/forum/posts?board_id=${context.query.boardId}`
  )
    .then((res) => res.json())
    .then((res) => res.posts)
    .catch((err) => {
      console.error("error fetching posts", err);
      return null;
    });

  return {
    props: {
      posts,
      boardName: board.name,
    },
  };
};

type BoardProps = {
  posts: PostType[];
  boardName: string;
};

const Board: NextPage<BoardProps> = ({ posts, boardName }) => {
  return (
    <main>
      <Link href="/forum">Back to Forums</Link>
      <h2 className={styles.boardHeader}>Forum: {boardName}</h2>
      {posts ? (
        <>
          {posts?.map((p) => (
            <Post post={p} />
          ))}
          {!posts?.length && <Trans>There are no posts yet.</Trans>}
        </>
      ) : (
        <Message type="error">
          <Trans>
            There was an error loading the posts. Please try again later.
          </Trans>
        </Message>
      )}
    </main>
  );
};

export default Board;
