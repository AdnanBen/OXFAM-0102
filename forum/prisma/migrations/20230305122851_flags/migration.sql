/*
  Warnings:

  - The `handled` column on the `PostFlag` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PostFlag" DROP COLUMN "handled",
ADD COLUMN     "handled" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CommentFlag" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handled" TIMESTAMP(3),

    CONSTRAINT "CommentFlag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentFlag" ADD CONSTRAINT "CommentFlag_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
