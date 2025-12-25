/*
  Warnings:

  - You are about to drop the column `analysisResults` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `findings` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `recommendations` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "analysisResults";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "findings",
DROP COLUMN "recommendations",
DROP COLUMN "summary",
ADD COLUMN     "file_path" TEXT;
