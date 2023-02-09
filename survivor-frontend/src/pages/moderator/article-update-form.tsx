import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchArticleById, updateArticleById } from "../../articles-helpers";
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

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const submitHandler = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    const requestObj = {
      title: title,
      body: content,
      category: category,
    };
    const id = Array.isArray(router.query.articleId)
      ? router.query.articleId[0]
      : router.query.articleId;
    updateArticleById(id, requestObj);
  };

  const handleTitleChange = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    const target = event.target as HTMLButtonElement;
    setTitle(target ? target.value : "");
  };

  const handleCategoryChange = (event: React.FormEvent<EventTarget>): void => {
    event.preventDefault();
    const target = event.target as HTMLButtonElement;
    setCategory(target ? target.value : "");
  };

  const loadArticle = (id: string) => {
    fetchArticleById(id).then((data) => {
      console.log("data", data);
      if (data.error) {
        setError(data.error);
      } else {
        setTitle(data.article.title);
        setCategory(data.article.category);
        setContent(data.article.body);
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
