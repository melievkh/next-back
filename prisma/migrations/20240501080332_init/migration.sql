/*
  Warnings:

  - You are about to drop the column `color` on the `outfits` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `outfits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "outfits" DROP COLUMN "color",
DROP COLUMN "size",
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "sizes" TEXT[];
