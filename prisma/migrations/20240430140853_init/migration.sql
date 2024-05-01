/*
  Warnings:

  - Made the column `firstname` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telegram_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "telegram_id" SET NOT NULL;
