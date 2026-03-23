-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "packageId" TEXT;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
