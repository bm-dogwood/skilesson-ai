-- CreateTable
CREATE TABLE "AISubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "aiDescription" TEXT NOT NULL,
    "aiFeedback" TEXT NOT NULL,
    "instructorFeedback" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AISubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AISubmission" ADD CONSTRAINT "AISubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
