import { useState } from "react";
import styles from "./forum.module.css";
import { Loader, Message, Modal } from "rsuite";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";

type Props = {
  id: number;
  title: string;
  tag: string;
  body: string;
  created: Date;
  comments: string[];
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Post: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: post,
    error,
    isLoading,
  } = useSWR(`http://localhost/api/forum/posts/${id}`, fetcher);

  console.log(post, error);

  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);

  const renderComments = (comments) => {
    return (
      <div>
        {comments.map((c) => {
          return (
            <>
              <div className={styles.commentWrapper} key={`comment-${c.id}`}>
                {c.parent_comment && (
                  <div className={styles.parentComment}>
                    <i>
                      on {new Date(c.parent_comment.created).toLocaleString()}
                    </i>
                    <p>{c.parent_comment.body}</p>
                  </div>
                )}
                {c.body}{" "}
                <span
                  className={styles.replyBtn}
                  onClick={() => {
                    setShowCommentDialog(true);
                    setReplyToComment(c.id);
                  }}
                >
                  ↲
                </span>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {showCommentDialog && (
        <Modal open onClose={() => setShowCommentDialog(false)}>
          <Modal.Header>
            <Modal.Title>New comment</Modal.Title>
            <Modal.Body>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = { body: formData.get("body") };
                  if (replyToComment) data.parentCommentId = replyToComment;

                  const res = await fetch(
                    `http://localhost/api/forum/posts/${id}/comments`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    }
                  ).then((res) => res.json());

                  if (!res.error) {
                    setShowCommentDialog(false);
                    setReplyToComment(null);
                  }
                }}
              >
                <label>
                  Comment:
                  <br />
                  <textarea name="body"></textarea>
                </label>
                <br />
                <button type="submit">Post comment</button>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
      )}

      {isLoading && <Loader />}

      {error && (
        <Message type="error">There was an error loading the post.</Message>
      )}

      {!!post && (
        <>
          <div className={styles.postHeader}>
            <h3>{post.post.title}</h3>
            <i className={styles.timestamp}>
              {new Date(post.post.created).toLocaleString()}
            </i>
          </div>
          <h3>{post.post.tag}</h3>
          <p>{post.post.body}</p>

          <div className={styles.commentsWrapper}>
            <strong>Replies</strong>{" "}
            <button onClick={() => setShowCommentDialog(true)}>
              add comment
            </button>
            {renderComments(post.post.comments)}
          </div>
        </>
      )}
    </>
  );
};

export default Post;
