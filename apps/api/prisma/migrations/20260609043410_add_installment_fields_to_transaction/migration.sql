-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "installmentEndDate" TIMESTAMP(3),
ADD COLUMN     "installmentMonths" INTEGER,
ADD COLUMN     "originalTransactionId" TEXT,
ADD COLUMN     "totalAmount" INTEGER;

-- CreateIndex
CREATE INDEX "Transaction_originalTransactionId_idx" ON "Transaction"("originalTransactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_originalTransactionId_fkey" FOREIGN KEY ("originalTransactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
