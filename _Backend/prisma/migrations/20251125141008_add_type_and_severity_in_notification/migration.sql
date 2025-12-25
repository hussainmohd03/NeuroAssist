/*
  Warnings:

  - Added the required column `severity` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('profile_updated', 'study_created', 'report_ready', 'study_status_changed');

-- CreateEnum
CREATE TYPE "NotificationSeverity" AS ENUM ('info', 'warning', 'critical', 'success', 'error');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "metaData" JSONB,
ADD COLUMN     "severity" "NotificationSeverity" NOT NULL,
ADD COLUMN     "type" "NotificationType" NOT NULL;
