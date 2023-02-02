-- CreateTable
CREATE TABLE "PostFlag" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PostFlag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostFlag" ADD CONSTRAINT "PostFlag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
