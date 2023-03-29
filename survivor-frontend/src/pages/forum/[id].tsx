import { t, Trans } from "@lingui/macro";
import { Turnstile } from "@marsidev/react-turnstile";
import RemindOutlineIcon from "@rsuite/icons/RemindOutline";
import { GetServerSideProps, type NextPage } from "next";
import { useRef, useState } from "react";
import { Button, IconButton, Input, Loader, Message, Modal } from "rsuite";
import sanitizeHTML from "sanitize-html";
import { getServerAuthSession } from "../../server/auth";
import fetchSSR from "../../server/fetchSSR";
import requireSSRTransition from "../../server/requireSSRTransition";
import styles from "../../styles/Forum.module.css";
import { fetchJsonApi } from "../../utils/helpers";
import useRouterRefresh from "../../utils/useRouterRefresh";
import useToaster from "../../utils/useToaster";

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access through the homepage, not directly
  const redirectNoDirectAccess = requireSSRTransition(context);
  if (redirectNoDirectAccess) return redirectNoDirectAccess;

  const post = await fetchSSR(`/api/forum/posts/${context.query.id}`).then(
    (res) => res?.post
  );

  return {
    props: {
      session: await getServerAuthSession(context),
      post,
    },
  };
};

const Post: NextPage = ({ post }) => {
  const toaster = useToaster();
  const [refresh, isRefresing] = useRouterRefresh(post);
  const [cftokennewcomment, setcftokennewcomment] = useState();
  const [cftokenreportpost, setcftokenreportpost] = useState();
  const [cftokenreportcomment, setcftokenreportcomment] = useState();
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const newcommentref = useRef(null);
  const reportcommentref = useRef(null);
  const reportpostref = useRef(null);
  const [reportcommentclicked, setreportcommentclicked] = useState(false);
  const [reportpostclicked, setreportpostclicked] = useState(false);
  const [newcommentclicked, setnewcommentclicked] = useState(false);

  const reportPost = async () => {
    await fetchJsonApi(`/api/forum/posts/${post.id}/flags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cftoken: cftokenreportpost,
        // validated: reportpostclicked,
      }),
    })
      .then(() => {
        toaster.push(
          <Message type="success" closable duration={2000}>
            <Trans>The post was reported successfully.</Trans>
          </Message>
        );
      })
      .catch((err) => {
        console.log(err);
        toaster.push(
          <Message type="error" duration={2000} closable>
            <Trans>
              There was an error reporting the post. Please try again later.
            </Trans>
          </Message>
        );
      });
    // Remove turnstile widget after first validation and set a state variable to ensure we aren't doing any extra CAPTCHA validations unneccesarily
    reportpostref.current?.remove();
    setreportpostclicked(true);
  };

  const reportComment = async (commentId: string) => {
    await fetchJsonApi(`/api/forum/comments/${commentId}/flags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cftoken: cftokenreportcomment,
        // validated: reportcommentclicked,
      }),
    })
      .then(() => {
        toaster.push(
          <Message type="success" closable duration={2000}>
            <Trans>The comment was reported successfully.</Trans>
          </Message>
        );
      })
      .catch((err) => {
        console.log(err);
        toaster.push(
          <Message type="error" duration={2000} closable>
            <Trans>
              There was an error reporting the comment. Please try again later.
            </Trans>
          </Message>
        );
      });
    reportcommentref.current?.remove();
    setreportcommentclicked(true);
  };

  const renderComments = (comments) => {
    // If there are comments to render the report post button does not play nicely with turnstile so we forcibly remove and rerender it to ensure it works
    reportpostref.current?.remove();
    reportpostref.current?.render();

    return (
      <div>
        {comments.map((c) => {
          return (
            <>
              <div className={styles.commentWrapper} key={`comment-${c.id}`}>
                {c.parent_comment && (
                  <div className={styles.parentComment}>
                    <i>
                      <Trans comment="e.g., on [date]">on</Trans>{" "}
                      {new Date(c.parent_comment.created).toUTCString()}
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
                {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
                  <Turnstile
                    ref={reportcommentref}
                    siteKey="0x4AAAAAAADFU0upW0ILDjJG"
                    onSuccess={(cftokenreportcomment) =>
                      setcftokenreportcomment(cftokenreportcomment)
                    }
                  />
                )}
                <IconButton
                  className={styles.reportBtn}
                  disabled={
                    process.env.NEXT_PUBLIC_NODE_ENV === "production" &&
                    !cftokenreportcomment
                  }
                  icon={<RemindOutlineIcon />}
                  style={{ float: "right" }}
                  appearance="ghost"
                  size="xs"
                  color="red"
                  onClick={() => reportComment(c.id)}
                >
                  Report comment?
                </IconButton>
              </div>
            </>
          );
        })}
      </div>
    );
  };

  return (
    <main>
      {showCommentDialog && (
        <Modal open onClose={() => setShowCommentDialog(false)}>
          <Modal.Header>
            <Modal.Title>
              <Trans>New comment</Trans>
            </Modal.Title>
            <Modal.Body>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = { body: formData.get("body") };
                  if (replyToComment) data.parentCommentId = replyToComment;
                  console.log("");
                  const res = await fetch(
                    `/api/forum/posts/${post.id}/comments`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...data,
                        cftoken: cftokennewcomment,
                        // validated: newcommentclicked,
                      }),
                    }
                  ).then((res) => res.json());
                  if (!res.error) {
                    setShowCommentDialog(false);
                    setReplyToComment(null);
                    refresh();
                    setnewcommentclicked(true);
                    newcommentref.current?.remove();
                  }
                }}
              >
                <label className={styles.newCommentLabel}>
                  <Trans>Comment</Trans>:
                  <br />
                  <Input
                    as="textarea"
                    name="body"
                    placeholder={t`Please enter your comment`}
                  />
                </label>
                <br />
                {process.env.NEXT_PUBLIC_NODE_ENV}
                {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
                  <Turnstile
                    ref={newcommentref}
                    siteKey="0x4AAAAAAADFU0upW0ILDjJG"
                    onSuccess={(cftokennewcomment) =>
                      setcftokennewcomment(cftokennewcomment)
                    }
                  />
                )}
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={
                    process.env.NEXT_PUBLIC_NODE_ENV === "production" &&
                    !cftokennewcomment
                  }
                >
                  <Trans>Post comment</Trans>
                </Button>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
      )}

      {post ? (
        <>
          <div className={styles.postHeader}>
            <h2>{post.title}</h2>
          </div>
          <div className={styles.postHeaderInfo}>
            <i className={styles.timestamp}>
              {new Date(post.created).toUTCString()}
            </i>
            {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
              <Turnstile
                ref={reportpostref}
                siteKey="0x4AAAAAAADFU0upW0ILDjJG"
                onSuccess={(cftokenreportpost) =>
                  setcftokenreportpost(cftokenreportpost)
                }
              />
            )}
            <IconButton
              className={styles.reportBtn}
              disabled={
                process.env.NEXT_PUBLIC_NODE_ENV === "production" &&
                !cftokenreportpost
              }
              icon={<RemindOutlineIcon />}
              appearance="ghost"
              size="xs"
              color="red"
              onClick={reportPost}
            >
              Report post?
            </IconButton>
          </div>
          <h3>{post.tag}</h3>
          <p
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.body) }}
            className={styles.body}
          />

          <div className={styles.commentsWrapper}>
            <h5>
              <Trans>Replies</Trans>
              <Button
                appearance="primary"
                size="sm"
                className={styles.addCommentBtn}
                onClick={() => setShowCommentDialog(true)}
              >
                <Trans>add comment?</Trans>
              </Button>
            </h5>
            {renderComments(post.comments)}
            {isRefresing && <Loader center />}
          </div>
        </>
      ) : (
        <Message type="error">
          <Trans>
            There was an error loading the post. Please try again later.
          </Trans>
        </Message>
      )}
    </main>
  );
};

export default Post;
