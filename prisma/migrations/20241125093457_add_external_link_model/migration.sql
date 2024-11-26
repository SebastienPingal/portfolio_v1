-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id")
);
