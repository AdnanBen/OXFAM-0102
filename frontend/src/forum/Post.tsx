import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./forum.module.css";
import { Modal } from "rsuite";

type Props = {
  id: number;
  title: string;
  tag: string;
  body: string;
  created: Date;
  comments: string[];
};

const Post = () => {
  const post = useLoaderData() as Props;
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
                    `http://localhost:8000/posts/${post.id}/comments`,
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

      <div className={styles.postHeader}>
        <h3>{post.title}</h3>
        <i className={styles.timestamp}>
          {new Date(post.created).toLocaleString()}
        </i>
      </div>
      <h3>{post.tag}</h3>
      <p>{post.body}</p>

      <div className={styles.commentsWrapper}>
        <strong>Replies</strong>{" "}
        <button onClick={() => setShowCommentDialog(true)}>add comment</button>
        {renderComments(post.comments)}
      </div>
    </>
  );
};

export default Post;
