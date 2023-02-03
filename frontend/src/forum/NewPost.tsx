import React from "react";
import { Link } from "react-router-dom";
import styles from "./forum.module.css";

function refreshPage(){ 
  window.location.reload(); 
}

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
      {/* TODO: Add something to show that the forum is submitted  */}
      <label> Post Title: </label>
      <input type="text" id="new_post_title" name="title" required />
      <br />
      <label>Post tag: </label>
      <select name="tagList" id="tagList">
      <option value="option 1">Physical Violence</option>
      <option value="option 2">Loneliness and Isolation</option>
      </select>
      <br />
      <label>Post Body: </label>
      <textarea id="new_post_body" name="body" required></textarea>
      <br />
      <input type="submit" value="Submit New Post" />
      <br />
      <br />
      <Link to="/forum"><button>
        Back to Forum
      </button>
      </Link>
    </form>
  );
};

export default NewPost;
