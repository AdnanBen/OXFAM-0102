import React, { useEffect, useState } from "react";

const Forum = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((res) => res.json())
      .then((res) => setPosts(res.posts))
      .catch((err) => console.error(err));
  }, []);

  console.log(posts);
  return (
    <>
      <h3>Forum Posts</h3>
      <ul>
        {posts.map((p: any) => (
          <li>
            <strong>{p.title}</strong> (posted on{" "}
            {new Date(p.created).toLocaleString()})
          </li>
        ))}
      </ul>
    </>
  );
};

export default Forum;
