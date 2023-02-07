import React from "react";
import styles from "./forum.module.css";

const NewPost = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        fetch("http://localhost:8000/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => console.log(res));
      }}
    >
      {/* TODO: Add Title input and Body textarea  */}
      <label> Post Title: </label>
      <input type="text" id="new_post_title" name="title" required />
      <br />
      <label>Post Body: </label>
      <textarea id="new_post_body" name="body" required></textarea>
      <br />
      <input type="submit" value="Submit New Post" />
    </form>
  );
};

export default NewPost;
