import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchArticleById, updateArticleById } from "../../articles-helpers";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    body: "",
  });

  const submitHandler = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    const id = Array.isArray(router.query.articleId)
      ? router.query.articleId[0]
      : router.query.articleId;
    updateArticleById(id, formData);
  };

  const loadArticle = (id: string) => {
    fetchArticleById(id).then((data) => {
      console.log("data", data);
      if (data.error) {
        setError(data.error);
      } else {
        setFormData(data.article);
      }
    });
  };

  useEffect(() => {
    const id = Array.isArray(router.query.articleId)
      ? router.query.articleId[0]
      : router.query.articleId;
    loadArticle(id);
  }, []);

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
            value={formData.body}
          />
        </Form.Group>

        <Form.Group>
          <Button type="submit" appearance="primary">
            Update Resource
          </Button>
        </Form.Group>

        <br />
        <p>{formData.body}</p>
      </Form>
    </main>
  );
}
