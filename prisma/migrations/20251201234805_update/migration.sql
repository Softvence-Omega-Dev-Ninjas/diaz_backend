/*
  Warnings:

  - The values [florida,jupiter] on the enum `SiteType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SiteType_new" AS ENUM ('FLORIDA', 'JUPITER');
ALTER TABLE "page_banners" ALTER COLUMN "site" TYPE "SiteType_new" USING ("site"::text::"SiteType_new");
ALTER TYPE "SiteType" RENAME TO "SiteType_old";
ALTER TYPE "SiteType_new" RENAME TO "SiteType";
DROP TYPE "public"."SiteType_old";
COMMIT;
