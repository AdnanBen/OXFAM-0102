import { Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import { Message } from "rsuite";
import fetchSSR from "../../server/fetchSSR";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/Forum.module.css";
import { Post, PostType } from "./index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const boards = await fetchSSR(`/api/forum/boards`).then((res) => res?.boards);
  const board = boards.find((b: any) => b.id === +context.query.boardId!);
  if (!board) return { notFound: true };

  const posts = await fetchSSR(
    `/api/forum/posts?board_id=${context.query.boardId}`
  ).then((res) => res?.posts);

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
      <h2 className={styles.boardHeader}>Forum: {boardName}</h2>
      {posts ? (
        <>
          {posts?.map((p) => (
            <Post post={p} />
          ))}
          {!posts?.length && (
            <Trans>
              <div>There are no posts yet.</div>
            </Trans>
          )}
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
