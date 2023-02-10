import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

import styles from "./forum.module.css";

type Post = {
  id: number;
  title: string;
  tag: string;
  created: number; // new Date(number)
  // commentCount: number;
};

const Post = ({ post }: { post: Post }) => {
  return (
    <a href={`/forum/${post.id}`} className={styles.post_link}>
      <div className={styles.post}>
        <p className={styles.post_id}>{post.id}</p>
        <p className={styles.post_title}>{post.title}</p>
        <p className={styles.post_tag}>{post.tag}</p>
        <p className={styles.post_date}>
          {new Date(post.created).toLocaleString()}
        </p>
      </div>
    </a>
  );
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Feed: NextPage = () => {
  const {
    data: posts,
    error,
    isLoading,
  } = useSWR(`/api/forum/posts`, fetcher);

  return (
    <>
      <Head>
        <title>Forum</title>
        <meta name="description" content="Forum" />
      </Head>

      <main>
        <h2>Forum</h2>
        {posts?.posts?.map((p) => (
          <Post post={p} />
        ))}
        <Link href="/forum/new">Add new post</Link>
      </main>
    </>
  );
};

export default Feed;
