/*
  Warnings:

  - A unique constraint covering the columns `[uploadId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "uploadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_uploadId_key" ON "Lesson"("uploadId");
