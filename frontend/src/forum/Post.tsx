import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import styles from "./forum.module.css";
import { Modal } from "rsuite";

type Props = {
  id: number;
  title: string;
  body: string;
  created: Date;
  comments: string[];
};

// TODO: implement reply logic
const Post = () => {
  const post = useLoaderData() as Props;
  const [newComment, setNewComment] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);

  const renderComments = (comments, level = 0) => {
    return (
      <div className={styles.comments} key={`comment-${level}`}>
        {comments.map((c) => {
          console.log(c);
          return (
            <div className={styles.comment} key={`comment-${c._id}`}>
              {c.body}{" "}
              <span
                className={styles.replyBtn}
                onClick={() => setReplyToComment(c._id)}
              >
                ↲
              </span>
              {!!c.replies?.length && renderComments(c.replies, ++level)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {newComment && (
        <Modal open onClose={() => setNewComment(false)}>
          <Modal.Header>
            <Modal.Title>New comment</Modal.Title>
            <Modal.Body>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = { body: formData.get("body") };

                  fetch(`http://localhost:8000/posts/${post.id}/comments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  })
                    .then((res) => res.json())
                    .then((res) => console.log(res));
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

      {replyToComment != null && (
        <Modal open onClose={() => setReplyToComment(null)}>
          <Modal.Header>
            <Modal.Title>Reply to comment</Modal.Title>
            <Modal.Body>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = { body: formData.get("body") };

                  fetch(
                    `http://localhost:8000/posts/${post.id}/comments/${replyToComment}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => console.log(res));
                }}
              >
                <label>
                  Comment:
                  <br />
                  <textarea name="body"></textarea>
                </label>
                <br />
                <button type="submit">Post reply</button>
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
      <p>{post.body}</p>

      <div className={styles.commentsWrapper}>
        <strong>Replies</strong>{" "}
        <button onClick={() => setNewComment(true)}>add comment</button>
        {renderComments(post.comments)}
      </div>
    </>
  );
};

export default Post;
