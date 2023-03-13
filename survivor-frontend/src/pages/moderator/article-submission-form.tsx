import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

import { GetServerSideProps } from "next";
import "react-quill/dist/quill.snow.css";
import { Button, Form } from "rsuite";
import { requireAuth } from "../../server/requireAuth";
import { fetchJsonApi } from "../../utils/helpers";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuth(context, "moderator");

export default function ArticleSubmissionForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
  });

  const submitHandler = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    fetchJsonApi(`/api/moderators/resources`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    }).then(() => router.replace("/moderator/resources"));
  };

  return (
    <main>
      <Form
        formValue={formData}
        onChange={setFormData}
        onSubmit={(valid, e) => submitHandler(e)}
      >
        <Form.Group>
          <Form.ControlLabel>Title</Form.ControlLabel>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter a title"
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Category</Form.ControlLabel>
          <Form.Control
            type="text"
            name="category"
            placeholder="Enter a category"
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Resource body</Form.ControlLabel>
          <QuillNoSSRWrapper
            modules={modules}
            onChange={(v) => setFormData((old) => ({ ...old, body: v }))}
            theme="snow"
          />
        </Form.Group>

        <Form.Group>
          <Button type="submit" appearance="primary">
            Save new Resource
          </Button>
        </Form.Group>

        <br />
        <p>{formData.body}</p>
      </Form>
    </main>
  );
}
