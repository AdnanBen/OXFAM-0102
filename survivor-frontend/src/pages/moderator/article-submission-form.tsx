import dynamic from "next/dynamic";
import { useState } from "react";
import { postResourceForm } from "../../articles-helpers";
import Router from "next/router";

import "react-quill/dist/quill.snow.css";
import { Button, Form } from "rsuite";

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

export default function ArticleSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
  });

  const submitHandler = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    postResourceForm(formData).then((data) => {
      if (data?.error) {
        console.log(data?.error);
        // setValues({ ...values, error: data.error });
      } else {
        console.log("article created");
        Router.push("/moderator/resources");
      }
    });
  };

  return (
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
  );
}
