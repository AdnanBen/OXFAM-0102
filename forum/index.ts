import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import { getDb } from "./db";
import { APIError, getNextMongoSequenceValue } from "./helpers";
import { ObjectId } from "mongodb";

function catchErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

dotenv.config();
const app = express();

app.use(bodyParser.json());

// TODO: remove this once the API gateway is configured for dev environments
app.use(cors());

/**
 * Global error handler.
 * Return custom status and message for all APIError instances.
 * Otherwise return generic internal server error.
 */
app.use((err: Error, req: Request, res: Response, next: any) => {
  if (err instanceof APIError && err.status) {
    return res.status(err.status).json({ error: true, message: err.message });
  }

  return res.status(500).json({
    error: true,
    message:
      "There was an unexpected error. Please try again later or contact us if the issue persists.",
  });
});

/**
 * Create a new top-level post.
 */
app.post(
  "/posts",
  catchErrors(async (req: Request, res: Response) => {
    const newId = await getNextMongoSequenceValue(getDb(), "posts");
    if (newId == null) throw new Error("Unable to get new post ID");

    const post = await getDb().collection("posts").insertOne({
      _id: newId,
      title: req.body.title,
      body: req.body.body,
      created: new Date().getTime(),
      comments: [],
    });

    return res.status(200).json({ error: false, id: post.insertedId });
  })
);

/**
 * Get all the top-level post titles.
 */
app.get(
  "/posts",
  catchErrors(async (req: Request, res: Response) => {
    // Don't get the post body itself
    const posts = getDb()
      .collection("posts")
      .find(
        {},
        {
          projection: { _id: true, title: true, created: true, verified: true },
        }
      );

    return res.status(200).json({ error: false, posts: await posts.toArray() });
  })
);

/**
 * Get a top-level post and all its comments.
 */
app.get(
  "/posts/:postId",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await getDb()
      .collection("posts")
      .findOne({ _id: { $eq: +[postId] } });

    if (!post) throw new APIError(404, "The requested post does not exist");

    return res.status(200).json({ error: false, post });
  })
);

/**
 * Delete a top-level post or comment
 * TODO: eventually, this should only be doable by a moderator (behind auth)
 */
app.delete(
  "/posts/:postId",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    // TODO: mark the post as deleted; don't actually delete it (i.e., soft-delete)
  })
);

/**
 * Make a new comment on the given top-level Post ID.
 */
app.post(
  "/posts/:postId/comments",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await getDb()
      .collection("posts")
      .findOne({ _id: { $eq: +postId } });

    if (!post) {
      throw new APIError(
        404,
        "The post you wish to comment on does not exist."
      );
    }

    const comment = await getDb()
      .collection("posts")
      .updateOne(
        { _id: +postId },
        {
          $push: {
            comments: {
              _id: new ObjectId(),
              body: req.body.body,
              created: new Date().getTime(),
              replies: [],
            },
          },
        }
      );

    return res.status(200).json({ error: false, id: comment.upsertedId });
  })
);

/**
 * Reply to a comment
 */
app.post(
  "/posts/:postId/comments/:commentId",
  catchErrors(async (req: Request, res: Response) => {
    const { postId, commentId: parentCommentId } = req.params;
    const post = await getDb()
      .collection("posts")
      .findOne({ _id: { $eq: +postId } });

    if (!post)
      throw new APIError(
        404,
        "The post you wish to comment on does not exist."
      );

    const comment = await getDb()
      .collection("posts")
      .updateOne(
        { _id: +postId },
        {
          $push: {
            "comments.$[comment].replies": {
              _id: new ObjectId(),
              body: req.body.body,
              created: new Date().getTime(),
              replies: [],
            },
          },
        },
        {
          arrayFilters: [{ "comment._id": new ObjectId(parentCommentId) }],
        }
      );

    return res.status(200).json({ error: false, id: comment.upsertedId });
  })
);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[forum]: Server is running at http://localhost:${port}`);
});
