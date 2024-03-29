-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(100) NOT NULL,
    "body" TEXT NOT NULL,
    "board_id" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "post_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("post_id","tag_name")
);

-- CreateTable
CREATE TABLE "PostFlag" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PostFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_comment_id" INTEGER,
    "post_id" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tag_name_fkey" FOREIGN KEY ("tag_name") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFlag" ADD CONSTRAINT "PostFlag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
