/*
  Warnings:

  - You are about to drop the column `cardCompany` on the `FixedExpense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FixedExpense" DROP COLUMN "cardCompany",
ADD COLUMN     "paymentMethodId" TEXT;

-- AddForeignKey
ALTER TABLE "FixedExpense" ADD CONSTRAINT "FixedExpense_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
