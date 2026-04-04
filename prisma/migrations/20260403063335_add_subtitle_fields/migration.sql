-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "subtitlesEnUrl" TEXT,
ADD COLUMN     "subtitlesEsUrl" TEXT,
ADD COLUMN     "subtitlesStatus" TEXT DEFAULT 'pending';
