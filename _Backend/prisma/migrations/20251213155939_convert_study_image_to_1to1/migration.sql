/*
  Warnings:

  - A unique constraint covering the columns `[studyId]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "images_studyId_key" ON "images"("studyId");
