/*
  Warnings:

  - You are about to drop the column `hasReceivedWelcomeEmail` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasReceivedWelcomeEmail" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "hasReceivedWelcomeEmail";
