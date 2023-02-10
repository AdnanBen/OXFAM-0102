import dynamic from "next/dynamic";
import { useState } from "react";
import { postResourceForm } from "../../articles-helpers";
import Router from "next/router";

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
    postResourceForm(requestObj).then((data) => {
      if (data?.error) {
        console.log(data?.error);
        // setValues({ ...values, error: data.error });
      } else {
        console.log("article created");
        // Router.reload("/admin-dashboard");
        // NextResponse.redirect("/admin-dashboard");
        Router.push("/moderator/resources");
      }
    });
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

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="title">Title</label>
      <br />
      <input
        type="text"
        value={title}
        name="title"
        placeholder="Enter a title"
        onChange={handleTitleChange}
        required
      />
      <br />
      <br />
      <label htmlFor="title">Category</label>
      <br />
      <input
        type="text"
        value={category}
        name="title"
        placeholder="Enter a category"
        onChange={handleCategoryChange}
        required
      />
      <br />
      <br />
      <QuillNoSSRWrapper modules={modules} onChange={setContent} theme="snow" />
      <button>Save</button>
      <br />
      <p>{content}</p>
    </form>
  );
}
