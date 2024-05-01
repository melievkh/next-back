/*
  Warnings:

  - A unique constraint covering the columns `[order_number]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `outfits` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "street" VARCHAR(100);

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" INTEGER NOT NULL,
ADD COLUMN     "longitude" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_order_number_key" ON "order"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "outfits_code_key" ON "outfits"("code");
