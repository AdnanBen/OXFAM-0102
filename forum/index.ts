import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import prisma from "./db";
import { APIError } from "./helpers";

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
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        board_id: req.body.board_id,
      },
    });

    return res.status(200).json({ error: false, id: post.id });
  })
);

/**
 * Get all the top-level post titles.
 * Optionally filter by board with ?board_id=id query parameter.
 */
app.get(
  "/posts",
  catchErrors(async (req: Request, res: Response) => {
    const { board_id: boardId } = req.query;

    // Don't get the post body itself
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, created: true },
      ...(boardId != null && { where: { board_id: +boardId } }),
    });

    return res.status(200).json({ error: false, posts });
  })
);

/**
 * Flag a post for moderator attention.
 * TODO: this should require a CAPTCHA (to avoid bots flooding site with spam flag requests).
 */
app.post(
  "/posts/:postId/flag",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;

    await prisma.postFlag.create({
      data: { post_id: +postId, timestamp: new Date() },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Get a top-level post and all its comments.
 */
app.get(
  "/posts/:postId",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;

    // Also fetch the parent comment, so we can have 'pairs' of most recent reply in the UI
    // rather than unlimited nesting.
    // Note: if needed, it is possible to extract the entire tree using a recursive query -- Prisma
    // doesn't support that yet https://github.com/prisma/prisma/issues/3725, but PostgreSQL does.
    const post = await prisma.post.findFirst({
      where: { id: +postId },
      include: { comments: { include: { parent_comment: true } } },
    });
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

    // Mark the post as deleted; don't actually delete it (i.e., soft-delete)
    await prisma.post.update({
      where: { id: +postId },
      data: { deleted: true },
    });

    return res.status(200).json({ error: false, postId });
  })
);

/**
 * Make a new comment on the given top-level Post ID.
 * Optionally pass the parentCommentId if replying to a comment.
 */
app.post(
  "/posts/:postId/comments",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({ where: { id: +postId } });

    if (!post) {
      throw new APIError(
        404,
        "The post you wish to comment on does not exist."
      );
    }

    const comment = await prisma.comment.create({
      data: {
        body: req.body.body,
        post_id: +postId,
        ...(req.body.parentCommentId != null && {
          parent_comment_id: req.body.parentCommentId,
        }),
      },
    });

    return res.status(200).json({ error: false, id: comment.id });
  })
);

/**
 * Get list of all boards
 */
app.get(
  "/boards",
  catchErrors(async (req: Request, res: Response) => {
    const boards = await prisma.board.findMany({
      select: { id: true, name: true, description: true },
    });
    return res.status(200).json({ error: false, boards });
  })
);

/**
 * Get list of all tags
 */
app.get(
  "/tags",
  catchErrors(async (req: Request, res: Response) => {
    const tags = await prisma.tag.findMany({
      select: { name: true, description: true },
    });

    return res.status(200).json({ error: false, tags });
  })
);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`⚡️[forum]: Server is running at http://localhost:${port}`);
});
