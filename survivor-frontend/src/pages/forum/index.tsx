import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button, Message } from "rsuite";
import { getServerAuthSession } from "../../server/auth";
import styles from "../../styles/Forum.module.css";

type Post = {
  id: number;
  title: string;
  tag: string;
  created: number; // new Date(number)
};

const Post = ({ post }: { post: Post }) => {
  return (
    <Link href={`/forum/${post.id}`} className={styles.post_link}>
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
  const posts = await fetch("http://localhost/api/forum/posts")
    .then((res) => res.json())
    .then((res) => res.posts)
    .catch((err) => {
      console.error("error fetching posts", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      posts,
    },
  };
};

const Feed: NextPage = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Forum</title>
        <meta name="description" content="Forum" />
      </Head>

      <main>
        <h2>Forum</h2>
        {posts ? (
          <>
            {posts?.map((p) => (
              <Post post={p} />
            ))}
            {!posts?.length && <div>There are no posts yet.</div>}
          </>
        ) : (
          <Message type="error">
            There was an error loading the posts. Please try again later.
          </Message>
        )}

        <Link href="/forum/new" className={styles.createPostBtn}>
          <Button appearance="primary">Create new post?</Button>
        </Link>
        <br />
        <h3>Boards</h3>
        <text>
          We have oragnised the posts according to the boards to make it easier
          for you to find support, information and talk to others with similar
          experiences.
        </text>
        <br />
        <input
          className={styles.board_search}
          type="text"
          placeholder="Search.."
        />
        <br />
        <button className={styles.board_button}>General discussion</button>
        <button className={styles.board_button}>Requests for advice</button>
        <button className={styles.board_button}>Tell me about yourself</button>
        <button className={styles.board_button}>Political discussions</button>
      </main>
    </>
  );
};

export default Feed;
