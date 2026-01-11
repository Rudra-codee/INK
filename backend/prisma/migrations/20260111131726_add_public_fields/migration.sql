/*
  Warnings:

  - A unique constraint covering the columns `[publicSlug]` on the table `StoryRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StoryRoom" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StoryRoom_publicSlug_key" ON "StoryRoom"("publicSlug");
