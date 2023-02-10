import { type NextPage } from "next";
import useSWR from "swr";

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button, Form, SelectPicker } from "rsuite";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
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

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const NewPost: NextPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    board_id: null,
    body: "",
  });

  const {
    data: boards,
    error,
    isLoading,
  } = useSWR(`/api/forum/boards`, fetcher);

  return (
    <>
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
            .then((res) => console.log(res));
        }}
      >
        <Form.Group>
          <Form.ControlLabel>Post Title</Form.ControlLabel>
          <Form.Control
            name="title"
            type="text"
            required
            block
            placeholder="Please enter the title of your post"
          />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Board</Form.ControlLabel>
          <Form.Control
            block
            placeholder="Please choose a category"
            accepter={SelectPicker}
            name="board_id"
            labelKey="name"
            valueKey="id"
            data={boards?.boards}
          />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Post Body</Form.ControlLabel>
          <QuillNoSSRWrapper
            modules={modules}
            theme="snow"
            onChange={(v) => setFormData((old) => ({ ...old, body: v }))}
            placeholder="Content goes here..."
          />
          <Form.HelpText>
            Please <strong>do not</strong> reveal any personally-identifiable
            information (e.g., your name, address, location) to protect your
            safety.
          </Form.HelpText>
        </Form.Group>

        <Form.Group>
          <Button type="submit" appearance="primary">
            Submit New Post
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

export default NewPost;
