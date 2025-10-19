/*
  Warnings:

  - A unique constraint covering the columns `[stripeCouponId]` on the table `promo_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCouponId` to the `promo_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "promo_codes" ADD COLUMN     "stripeCouponId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_stripeCouponId_key" ON "promo_codes"("stripeCouponId");
