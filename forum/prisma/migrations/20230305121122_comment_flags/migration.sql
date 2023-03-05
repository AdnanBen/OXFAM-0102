-- CreateTable
CREATE TABLE "CommentFlag" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CommentFlag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentFlag" ADD CONSTRAINT "CommentFlag_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
