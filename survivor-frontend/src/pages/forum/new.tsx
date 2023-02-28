import { Trans } from "@lingui/macro";
import { GetServerSideProps, type NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Button, Form, SelectPicker } from "rsuite";
import { getServerAuthSession } from "../../server/auth";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => (
    <p>
      <Trans>Loading</Trans>...
    </p>
  ),
});

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const boards = await fetch("http://localhost/api/forum/boards")
    .then((res) => res.json())
    .then((res) => res.boards)
    .catch((err) => {
      console.error("error fetching boards", err);
      return null;
    });

  return {
    props: {
      session: await getServerAuthSession(context),
      boards,
    },
  };
};

const NewPost: NextPage = ({ boards }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    board_id: null,
    body: "",
  });

  return (
    <main>
      <h2>New Forum Post</h2>

      {/* TODO: Add something to show that the forum is submitted  */}
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v)}
        onSubmit={(valid, e) => {
          e.preventDefault();
          fetch("/api/forum/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (!res.error) {
                router.push("/forum");
              }
            });
        }}
      >
        <Form.Group>
          <Form.ControlLabel>
            <Trans>Post Title</Trans>
          </Form.ControlLabel>
          <Form.Control
            name="title"
            type="text"
            required
            block
            placeholder="Please enter the title of your post"
          />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>
            <Trans>Board</Trans>
          </Form.ControlLabel>
          <Form.Control
            block
            placeholder="Please choose a category"
            accepter={SelectPicker}
            name="board_id"
            labelKey="name"
            valueKey="id"
            data={boards ?? []}
          />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>
            <Trans>Post Body</Trans>
          </Form.ControlLabel>
          <QuillNoSSRWrapper
            modules={modules}
            theme="snow"
            onChange={(v) => setFormData((old) => ({ ...old, body: v }))}
            placeholder="Content goes here..."
          />
          <Form.HelpText>
            <Trans>
              Please <strong>do not</strong> reveal any personally-identifiable
              information (e.g., your name, address, location) to protect your
              safety.
            </Trans>
          </Form.HelpText>
        </Form.Group>

        <Form.Group>
          <Button type="submit" appearance="primary">
            <Trans>Submit New Post</Trans>
          </Button>
        </Form.Group>
      </Form>
    </main>
  );
};

export default NewPost;
