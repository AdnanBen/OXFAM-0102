import React from "react";
import { useLoaderData, Link } from "react-router-dom";
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

const Feed = () => {
  const posts = useLoaderData() as Post[];

  return (
    <>
      {posts.map((p) => (
        <Post post={p} />
      ))}
      <Link to="/forum/new">Add new forum</Link>
    </>
  );
};

export default Feed;
