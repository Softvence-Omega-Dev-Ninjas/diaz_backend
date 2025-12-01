-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('HOME', 'BLOG', 'CONTACT', 'SEARCH', 'PRIVACY_POLICY', 'TERMS_AND_CONDITION');

-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('florida', 'jupiter');

-- CreateTable
CREATE TABLE "page_banners" (
    "id" TEXT NOT NULL,
    "page" "PageType" NOT NULL,
    "site" "SiteType" NOT NULL,
    "bannerTitle" TEXT NOT NULL,
    "subtitle" TEXT,
    "logoId" TEXT,
    "backgroundId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_banners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "page_banners" ADD CONSTRAINT "page_banners_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "file_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_banners" ADD CONSTRAINT "page_banners_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "file_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
