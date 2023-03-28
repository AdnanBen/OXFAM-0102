import * as appInsights from "applicationinsights";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import sanitizeHTML from "sanitize-html";

import prisma from "./db";
import { APIError, requireCaptcha } from "./helpers";

function catchErrors(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

if (process.env.NODE_ENV === "production") {
  dotenv.config();
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setAutoCollectPreAggregatedMetrics(true)
    .setSendLiveMetrics(false)
    .setAutoCollectHeartbeat(false)
    .setAutoCollectIncomingRequestAzureFunctions(true)
    .setInternalLogging(true, true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .enableWebInstrumentation(false)
    .start();
}

const app = express();

app.use(bodyParser.json());

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
    await requireCaptcha(req);

    // Don't allow any HTML for Title
    const title = sanitizeHTML(req.body.title ?? "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    const body = sanitizeHTML(req.body.body ?? "");

    // Ensure title and body both have content, even after sanitisation
    if (!title || !body) {
      throw new APIError(400, "You did not provide valid post details");
    }

    try {
      const post = await prisma.post.create({
        data: { title, body, board: { connect: { id: req.body.board_id } } },
      });

      return res.status(200).json({ error: false, id: post.id });
    } catch (err) {
      // Dependent record do not exist
      if (err.code === "P2025") {
        throw new APIError(404, "The requested board does not exist");
      }

      throw err;
    }
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
      where: {
        deleted: false,
        ...(boardId != null && { board_id: +boardId }),
      },
    });

    return res.status(200).json({ error: false, posts });
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
      where: { id: +postId, deleted: false },
      select: {
        comments: {
          select: { id: true, parent_comment: true, body: true, created: true },
        },
        body: true,
        id: true,
        title: true,
        created: true,
      },
    });
    if (!post) throw new APIError(404, "The requested post does not exist");

    return res.status(200).json({ error: false, post });
  })
);

/**
 * Flag a post as abusive/spam for moderator attention.
 */
app.post(
  "/posts/:postId/flags",
  catchErrors(async (req: Request, res: Response) => {
    await requireCaptcha(req);

    const { postId } = req.params;

    const post = await prisma.post.findFirst({
      where: { id: +postId, deleted: false },
    });

    if (!post) {
      throw new APIError(404, "The post you wish to flag does not exist");
    }

    await prisma.post.update({
      data: { flags: { increment: 1 } },
      where: { id: +postId },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Make a new comment on the given top-level Post ID.
 * Optionally pass the parentCommentId if replying to a comment.
 */
app.post(
  "/posts/:postId/comments",
  catchErrors(async (req: Request, res: Response) => {
    await requireCaptcha(req);

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
        body: sanitizeHTML(req.body.body),
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
 * Flag a comment as abusive/spam for moderator attention.
 */
app.post(
  "/comments/:commentId/flags",
  catchErrors(async (req: Request, res: Response) => {
    await requireCaptcha(req);

    const { commentId } = req.params;

    const comment = await prisma.comment.findFirst({
      where: { id: +commentId, deleted: false },
    });

    if (!comment) {
      throw new APIError(404, "The comment you wish to flag does not exist.");
    }

    await prisma.comment.update({
      data: { flags: { increment: 1 } },
      where: { id: +commentId },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Get list of all boards.
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
 * Get list of all tags.
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

// =====================================================================
// ==========================Moderator actions==========================
// =====================================================================

/**
 * Get all flagged comments.
 */
app.get(
  "/moderator/comments/flagged",
  catchErrors(async (req: Request, res: Response) => {
    const comments = await prisma.comment.findMany({
      where: { flags: { gt: 0 }, deleted: false },
      select: {
        Post: { select: { id: true, title: true } },
        id: true,
        body: true,
        created: true,
        flags: true,
      },
    });

    return res.status(200).json({ error: false, comments });
  })
);

/**
 * Mark a comment's flags as handled (e.g., ignored).
 */
app.delete(
  "/moderator/comments/:commentId/flags",
  catchErrors(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const comment = await prisma.comment.findFirst({
      where: { id: +commentId, deleted: false },
    });
    if (!comment) throw new APIError(404, "The comment does not exist");

    await prisma.comment.update({
      data: { flags: 0 },
      where: { id: +commentId },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Delete a top-level comment.
 */
app.delete(
  "/moderator/comments/:commentId",
  catchErrors(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const comment = await prisma.comment.findFirst({
      where: { id: +commentId, deleted: false },
    });
    if (!comment) throw new APIError(404, "The comment does not exist");

    // Mark the comment as deleted; don't actually delete it (i.e., soft-delete)
    // Mark all the flags for this comment as handled
    await prisma.comment.update({
      where: { id: +commentId },
      data: { deleted: true, flags: 0 },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Get all flagged posts.
 */
app.get(
  "/moderator/posts/flagged",
  catchErrors(async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany({
      where: { flags: { gt: 0 }, deleted: false },
      select: {
        id: true,
        body: true,
        title: true,
        created: true,
        flags: true,
      },
    });

    return res.status(200).json({ error: false, posts });
  })
);

/**
 * Mark a post's flags as handled (e.g., ignored).
 */
app.delete(
  "/moderator/posts/:postId/flags",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({
      where: { id: +postId, deleted: false },
    });
    if (!post) throw new APIError(404, "The post does not exist");

    await prisma.post.update({
      data: { flags: 0 },
      where: { id: +postId },
    });

    return res.status(200).json({ error: false });
  })
);

/**
 * Delete a top-level post.
 */
app.delete(
  "/moderator/posts/:postId",
  catchErrors(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({
      where: { id: +postId, deleted: false },
    });
    if (!post) throw new APIError(404, "The post does not exist");

    // Mark the post as deleted; don't actually delete it (i.e., soft-delete)
    // Mark all the flags for this post as handled
    await prisma.post.update({
      where: { id: +postId },
      data: { deleted: true, flags: 0 },
    });

    return res.status(200).json({ error: false });
  })
);

const port = typeof process.env.PORT === "undefined" ? 3000 : +process.env.PORT;
app.listen(port, "0.0.0.0", () => {
  console.log(`⚡️[forum]: Server is running at http://localhost:${port}`);
});

export { app };
