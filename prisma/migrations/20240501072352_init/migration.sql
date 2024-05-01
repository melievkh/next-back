-- CreateEnum
CREATE TYPE "store_type" AS ENUM ('online', 'physical');

-- AlterTable
ALTER TABLE "store" ADD COLUMN     "type" "store_type" NOT NULL DEFAULT 'online';
