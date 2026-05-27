-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('NEW_USER', 'NEW_DEVICE');

-- AlterTable
ALTER TABLE "ApprovalRequest" ADD COLUMN     "type" "RequestType" NOT NULL DEFAULT 'NEW_USER';
