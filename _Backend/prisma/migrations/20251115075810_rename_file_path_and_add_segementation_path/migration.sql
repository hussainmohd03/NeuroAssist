/*
  Warnings:

  - You are about to drop the column `file_path` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "segmentationPath" TEXT;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "file_path",
ADD COLUMN     "filePath" TEXT;
