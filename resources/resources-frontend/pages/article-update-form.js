import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchArticleById, updateArticleById } from "../api/articles";
import { useRouter } from "next/router";

import "react-quill/dist/quill.snow.css";

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
  console.log("router.query.articleId", router.query.articleId);

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  console.log("content", content);

  function submitHandler(event) {
    event.preventDefault();
    const requestObj = {
      title: title,
      body: content,
      category: category,
    };
    updateArticleById(router.query.articleId, requestObj);
  }

  function handleTitleChange(event) {
    event.preventDefault();
    setTitle(event.target.value);
  }

  function handleCategoryChange(event) {
    event.preventDefault();
    setCategory(event.target.value);
  }

  const loadArticle = (id) => {
    fetchArticleById(id).then((data) => {
      console.log("data", data);
      if (data.error) {
        setError(data.error);
      } else {
        console.lg;
        setTitle(data.article.title);
        setCategory(data.article.category);
        setContent(data.article.body);
      }
    });
  };

  useEffect(() => {
    loadArticle(router.query.articleId);
  }, []);

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        value={title}
        name="title"
        placeholder="Enter a title"
        onChange={handleTitleChange}
        required
      />
      <label htmlFor="title">Category</label>
      <input
        type="text"
        value={category}
        name="title"
        placeholder="Enter a category"
        onChange={handleCategoryChange}
        required
      />
      <QuillNoSSRWrapper
        modules={modules}
        onChange={(html) => setContent(html)}
        // onChange={setContent}
        theme="snow"
        value={content}
      />
      <button>Save</button>
    </form>
  );
}
