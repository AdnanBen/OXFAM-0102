/*
  Warnings:

  - You are about to drop the `PostFlag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostFlag" DROP CONSTRAINT "PostFlag_post_id_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "flags" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "PostFlag";
