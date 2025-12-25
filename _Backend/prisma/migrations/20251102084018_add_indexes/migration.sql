-- CreateIndex
CREATE INDEX "images_studyId_idx" ON "images"("studyId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "reports_studyId_idx" ON "reports"("studyId");

-- CreateIndex
CREATE INDEX "studies_userId_idx" ON "studies"("userId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
