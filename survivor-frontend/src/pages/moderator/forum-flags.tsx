import { Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { Button, ButtonToolbar, Loader, Message, Table } from "rsuite";
import useSWR from "swr";
import { requireAuth } from "../../server/requireAuth";
import { fetcher, fetchJsonApi } from "../../utils/helpers";
import useToaster from "../../utils/useToaster";

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

const performDeleteRequest = async (url: string) =>
  fetchJsonApi(url, { method: "DELETE" });

const dismissCommentFlag = async (commentId: string) =>
  performDeleteRequest(`/api/moderators/forum/comments/${commentId}/flags`);

const deleteComment = async (commentId: string) =>
  performDeleteRequest(`/api/moderators/forum/comments/${commentId}`);

const dismissPostFlag = async (postId: string) =>
  performDeleteRequest(`/api/moderators/forum/posts/${postId}/flags`);

const deletePost = async (postId: string) =>
  performDeleteRequest(`/api/moderators/forum/posts/${postId}`);

const BodyCell = ({ rowData, ...props }: any) => (
  <Table.Cell {...props}>
    <div dangerouslySetInnerHTML={{ __html: rowData.body }} />
  </Table.Cell>
);

const ActionsCell = ({ rowData, type, toaster, mutate, ...props }: any) => (
  <Table.Cell {...props}>
    <ButtonToolbar>
      <Button
        appearance="ghost"
        color="red"
        size="sm"
        onClick={async () => {
          const fn = type === "post" ? deletePost : deleteComment;
          await fn(rowData.id)
            .then(() => {
              toaster.push(
                <Message type="success" closable>
                  The content was successfully deleted.
                </Message>
              );
              mutate();
            })
            .catch((err) =>
              toaster.push(
                <Message type="error" closable duration={0}>
                  There was an error deleting the content. Please try again
                  later or contact the administrator if the issue persists.
                </Message>
              )
            );
        }}
      >
        Delete {type}
      </Button>
      <Button
        appearance="ghost"
        color="blue"
        size="sm"
        onClick={async () => {
          const fn = type === "post" ? dismissPostFlag : dismissCommentFlag;
          await fn(rowData.id)
            .then(() => {
              toaster.push(
                <Message type="success" closable>
                  The flags were successfully dismissed.
                </Message>
              );
              mutate();
            })
            .catch((err) =>
              toaster.push(
                <Message type="error" closable duration={0}>
                  There was an error dismissing the flags. Please try again
                  later or contact the administrator if the issue persists.
                </Message>
              )
            );
        }}
      >
        Dismiss flags
      </Button>
    </ButtonToolbar>
  </Table.Cell>
);

export default function ForumFlags() {
  const toaster = useToaster();

  const {
    data: flaggedPosts,
    error: flaggedPostsError,
    isLoading: flaggedPostsLoading,
    mutate: flaggedPostsMutate,
  } = useSWR("/api/moderators/forum/posts/flagged", fetcher);

  const {
    data: flaggedComments,
    error: flaggedCommentsError,
    isLoading: flaggedCommentsLoading,
    mutate: flaggedCommentsMutate,
  } = useSWR("/api/moderators/forum/comments/flagged", fetcher);

  return (
    <main>
      <h3>Forum Flags</h3>

      <h4>Posts</h4>
      {flaggedPostsError && (
        <Message type="error">
          <Trans>
            There was an error loading the flagged posts. Please try again later
            or contact the administrator if the issue persists.
          </Trans>
        </Message>
      )}
      {flaggedPostsLoading && <Loader size="lg" backdrop />}
      {flaggedPosts?.posts && (
        <Table data={flaggedPosts?.posts} wordWrap="break-word">
          <Table.Column width={80}>
            <Table.HeaderCell># of flags</Table.HeaderCell>
            <Table.Cell dataKey="flags" />
          </Table.Column>
          <Table.Column flexGrow={2}>
            <Table.HeaderCell>Flagged content</Table.HeaderCell>
            <BodyCell dataKey="body" />
          </Table.Column>
          <Table.Column width={250}>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <ActionsCell
              type="post"
              toaster={toaster}
              mutate={flaggedPostsMutate}
            />
          </Table.Column>
        </Table>
      )}

      <h4>Comments</h4>
      {flaggedCommentsError && (
        <Message type="error">
          <Trans>
            There was an error loading the flagged comments. Please try again
            later or contact the administrator if the issue persists.
          </Trans>
        </Message>
      )}
      {flaggedCommentsLoading && <Loader size="lg" backdrop />}
      {flaggedComments?.comments && (
        <Table data={flaggedComments?.comments} wordWrap="break-word">
          <Table.Column width={80}>
            <Table.HeaderCell># of flags</Table.HeaderCell>
            <Table.Cell dataKey="flags" />
          </Table.Column>{" "}
          <Table.Column flexGrow={2}>
            <Table.HeaderCell>Flagged content</Table.HeaderCell>
            <BodyCell />
          </Table.Column>
          <Table.Column width={270}>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <ActionsCell
              type="comment"
              toaster={toaster}
              mutate={flaggedCommentsMutate}
            />
          </Table.Column>
        </Table>
      )}
    </main>
  );
}
