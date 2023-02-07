import "rsuite/dist/rsuite.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feed from "./src/forum/Feed";
import Post from "./src/forum/Post";
import NewPost from "./src/forum/NewPost";
import ModeratorDashboard from "./src/chat/ModeratorDashboard";
import UserChat from "./src/chat/UserChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "forum",
        loader: async () => {
          const res = await fetch(`http://localhost:8000/posts`).then((r) =>
            r.json()
          );
          return res.posts;
        },
        element: <Feed />,
      },
      {
        path: "forum/:id",
        loader: async ({ params }) => {
          const res = await fetch(
            `http://localhost:8000/posts/${params.id}`
          ).then((r) => r.json());
          return { ...res.post, id: params.id };
        },
        element: <Post />,
      },
      {
        path: "forum/new",
        element: <NewPost />,
      },
      {
        path: "moderator-dashboard",
        element: <ModeratorDashboard />,
      },
      {
        path: "chat",
        element: <UserChat />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<RouterProvider router={router} />);
