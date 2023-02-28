import { GetServerSideProps, type NextPage } from "next";
import { useState } from "react";
import { Loader, Message, Modal } from "rsuite";
import sanitizeHTML from "sanitize-html";
import { getServerAuthSession } from "../../server/auth";
import styles from "../../styles/Forum.module.css";
import useRouterRefresh from "../../utils/useRouterRefresh";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const post = await fetch(
    `http://localhost/api/forum/posts/${context.query.id}`
  )
    .then((res) => res.json())
    .then((res) => res.post)
    .catch((err) => {
      console.error("error fetching post", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      post,
    },
  };
};

const Post: NextPage = ({ post }) => {
  const [refresh, isRefresing] = useRouterRefresh(post);
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
                    <i>on {new Date(c.parent_comment.created).toUTCString()}</i>
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
                    `/api/forum/posts/${post.id}/comments`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    }
                  ).then((res) => res.json());

                  if (!res.error) {
                    setShowCommentDialog(false);
                    setReplyToComment(null);
                    refresh();
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

      {post ? (
        <>
          <div className={styles.postHeader}>
            <h3>{post.title}</h3>
            <i className={styles.timestamp}>
              {new Date(post.created).toUTCString()}
            </i>
          </div>
          <h3>{post.tag}</h3>
          <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }} />

          <div className={styles.commentsWrapper}>
            <strong>Replies</strong>{" "}
            <button onClick={() => setShowCommentDialog(true)}>
              add comment
            </button>
            {renderComments(post.comments)}
            {isRefresing && <Loader center />}
          </div>
        </>
      ) : (
        <Message type="error">There was an error loading the post.</Message>
      )}
    </>
  );
};

export default Post;
