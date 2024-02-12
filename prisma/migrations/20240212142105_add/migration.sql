-- CreateTable
CREATE TABLE "StackOnPost" (
    "postId" TEXT NOT NULL,
    "stackId" TEXT NOT NULL,

    CONSTRAINT "StackOnPost_pkey" PRIMARY KEY ("postId","stackId")
);

-- AddForeignKey
ALTER TABLE "StackOnPost" ADD CONSTRAINT "StackOnPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StackOnPost" ADD CONSTRAINT "StackOnPost_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
