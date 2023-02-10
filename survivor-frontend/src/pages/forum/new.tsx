import { type NextPage } from "next";
import Link from "next/link";
import styles from "./forum.module.css";
import useSWR from "swr";

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useState } from "react";

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
  const [content, setContent] = useState("");

  const {
    data: boards,
    error,
    isLoading,
  } = useSWR(`/api/forum/boards`, fetcher);

  return (
    <>
      <h2>New Forum Post</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = {};
          for (const [key, value] of formData.entries()) {
            data[key] = value;
          }
          data.body = content;
          data.board_id = parseInt(data.board_id, 10);
          fetch("/api/forum/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
            .then((res) => res.json())
            .then((res) => console.log(res));
        }}
      >
        {/* TODO: Add something to show that the forum is submitted  */}
        <label>
          Post Title:{" "}
          <input type="text" id="new_post_title" name="title" required />
        </label>
        <br />
        <label>
          Board:{" "}
          <select name="board_id" id="boards">
            {boards?.boards?.map((b) => (
              <option value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Post Body:{" "}
          {/*<textarea id="new_post_body" name="body" required></textarea>
          <br />*/}
        </label>
        <QuillNoSSRWrapper
          modules={modules}
          theme="snow"
          onChange={setContent}
          placeholder="Content goes here..."
        />
        <br />
        <input type="submit" value="Submit New Post" />
        <br />
        <br />
        <Link href="/forum">
          <button>Back to Forum</button>
        </Link>
      </form>
    </>
  );
};

export default NewPost;
