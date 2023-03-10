import { t, Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Message } from "rsuite";
import { env } from "../../env/env.mjs";
import styles from "../../styles/Forum.module.css";
import { Post, PostType, BoardType } from "./index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await fetch(
    `${env.SSR_HOST}/api/forum/posts?board_id=${context.query.boardId}`
  )
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

  const boardName = boards.find((b) => b.id === +context.query.boardId!);

  return {
    props: {
      posts,
      boards,
      boardName,
    },
  };
};

type BoardProps = {
  posts: PostType[];
  boards: BoardType[];
  boardName: string;
};

const Board: NextPage<BoardProps> = ({ posts, boards, boardName }) => {
  return (
    <>
      <Link href="/forum">Back to Forums</Link>
      <div>{boardName}</div>
      {posts ? (
        <>
          {posts?.map((p) => (
            <Post post={p} />
          ))}
          {!posts?.length && (
            <div>
              <Trans>There are no posts yet.</Trans>
            </div>
          )}
        </>
      ) : (
        <Message type="error">
          <Trans>
            There was an error loading the posts. Please try again later.
          </Trans>
        </Message>
      )}
    </>
  );
};

export default Board;
