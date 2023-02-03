import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import styles from "./forum.module.css";

function refreshPage() {
  window.location.reload();
}

const NewPost = () => {
  const boards = useLoaderData();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {};
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
        data.board_id = parseInt(data.board_id, 10);
        fetch("http://localhost:8000/posts", {
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
          {boards.map((b) => (
            <option value={b.id}>{b.name}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Post Body: <textarea id="new_post_body" name="body" required></textarea>
        <br />
      </label>
      <input type="submit" value="Submit New Post" />
      <br />
      <br />
      <Link to="/forum">
        <button>Back to Forum</button>
      </Link>
    </form>
  );
};

export default NewPost;
