/*
  Warnings:

  - The values [cap] on the enum `outfits_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "outfits_category_new" AS ENUM ('caps', 'pants', 'shoes', 'sneakers', 't_shirts', 'other');
ALTER TABLE "outfits" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "outfits" ALTER COLUMN "category" TYPE "outfits_category_new" USING ("category"::text::"outfits_category_new");
ALTER TYPE "outfits_category" RENAME TO "outfits_category_old";
ALTER TYPE "outfits_category_new" RENAME TO "outfits_category";
DROP TYPE "outfits_category_old";
ALTER TABLE "outfits" ALTER COLUMN "category" SET DEFAULT 'other';
COMMIT;
