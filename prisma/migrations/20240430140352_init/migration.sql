/*
  Warnings:

  - You are about to drop the column `telegram_dd` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "telegram_dd",
ADD COLUMN     "telegram_id" TEXT;
