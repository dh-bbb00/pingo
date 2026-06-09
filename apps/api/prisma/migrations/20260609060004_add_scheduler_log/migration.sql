-- CreateEnum
CREATE TYPE "SchedulerLogType" AS ENUM ('BUDGET_ROLLOVER', 'FIXED_EXPENSES', 'INSTALLMENTS');

-- CreateEnum
CREATE TYPE "SchedulerTrigger" AS ENUM ('CRON', 'MANUAL');

-- CreateTable
CREATE TABLE "SchedulerLog" (
    "id" TEXT NOT NULL,
    "type" "SchedulerLogType" NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "totalCount" INTEGER NOT NULL,
    "successCount" INTEGER NOT NULL,
    "error" TEXT,
    "triggeredBy" "SchedulerTrigger" NOT NULL,

    CONSTRAINT "SchedulerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SchedulerLog_type_year_month_idx" ON "SchedulerLog"("type", "year", "month");

-- CreateIndex
CREATE INDEX "SchedulerLog_year_month_idx" ON "SchedulerLog"("year", "month");
