/*
  Warnings:

  - You are about to drop the column `userId` on the `studies` table. All the data in the column will be lost.
  - Added the required column `doctor` to the `studies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."studies" DROP CONSTRAINT "studies_userId_fkey";

-- DropIndex
DROP INDEX "public"."studies_userId_idx";

-- AlterTable
ALTER TABLE "studies" DROP COLUMN "userId",
ADD COLUMN     "doctor" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "studies_doctor_idx" ON "studies"("doctor");

-- AddForeignKey
ALTER TABLE "studies" ADD CONSTRAINT "studies_doctor_fkey" FOREIGN KEY ("doctor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
