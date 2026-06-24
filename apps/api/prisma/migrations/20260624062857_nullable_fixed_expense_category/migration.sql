-- DropForeignKey
ALTER TABLE "FixedExpense" DROP CONSTRAINT "FixedExpense_categoryId_fkey";

-- AlterTable
ALTER TABLE "FixedExpense" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FixedExpense" ADD CONSTRAINT "FixedExpense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
