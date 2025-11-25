-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Document_ownerId_favorite_idx" ON "Document"("ownerId", "favorite");

-- CreateIndex
CREATE INDEX "Document_ownerId_trashed_idx" ON "Document"("ownerId", "trashed");
