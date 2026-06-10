-- CreateEnum
CREATE TYPE "SchedulerLogStatus" AS ENUM ('NOT_RUN', 'SUCCESS', 'FAILURE');

-- AlterTable: status 컬럼 추가 (기존 success 값으로 마이그레이션)
ALTER TABLE "SchedulerLog" ADD COLUMN "status" "SchedulerLogStatus";
UPDATE "SchedulerLog" SET "status" = CASE WHEN "success" = true THEN 'SUCCESS'::"SchedulerLogStatus" ELSE 'FAILURE'::"SchedulerLogStatus" END;
ALTER TABLE "SchedulerLog" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "SchedulerLog" ALTER COLUMN "status" SET DEFAULT 'NOT_RUN'::"SchedulerLogStatus";

-- AlterTable: success 컬럼 제거
ALTER TABLE "SchedulerLog" DROP COLUMN "success";

-- AlterTable: NOT_RUN 항목 지원을 위해 nullable로 변경
ALTER TABLE "SchedulerLog" ALTER COLUMN "runAt" DROP NOT NULL;
ALTER TABLE "SchedulerLog" ALTER COLUMN "totalCount" DROP NOT NULL;
ALTER TABLE "SchedulerLog" ALTER COLUMN "successCount" DROP NOT NULL;
ALTER TABLE "SchedulerLog" ALTER COLUMN "triggeredBy" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "SchedulerLog_status_idx" ON "SchedulerLog"("status");
