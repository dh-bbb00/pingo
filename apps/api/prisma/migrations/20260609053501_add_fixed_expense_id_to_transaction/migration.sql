-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fixedExpenseId" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_fixedExpenseId_idx" ON "Transaction"("fixedExpenseId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fixedExpenseId_fkey" FOREIGN KEY ("fixedExpenseId") REFERENCES "FixedExpense"("id") ON DELETE SET NULL ON UPDATE CASCADE;
