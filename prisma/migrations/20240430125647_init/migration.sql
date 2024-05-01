-- CreateEnum
CREATE TYPE "store_category" AS ENUM ('outfits', 'other');

-- CreateEnum
CREATE TYPE "store_role" AS ENUM ('admin', 'store');

-- CreateEnum
CREATE TYPE "outfits_category" AS ENUM ('cap', 'pants', 'shoes', 'sneakers', 't_shirts', 'other');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'accepted', 'completed', 'deleted');

-- CreateTable
CREATE TABLE "store" (
    "id" TEXT NOT NULL,
    "category" "store_category"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo_url" VARCHAR(250),
    "phone_number" TEXT[],
    "role" "store_role" NOT NULL DEFAULT 'store',
    "storename" VARCHAR(250) NOT NULL,
    "address_id" TEXT,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstname" TEXT,
    "phone_number" TEXT,
    "telegram_dd" TEXT,
    "username" TEXT,
    "address_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfits" (
    "id" TEXT NOT NULL,
    "brand" TEXT,
    "category" "outfits_category" NOT NULL DEFAULT 'other',
    "color" TEXT[],
    "code" TEXT NOT NULL,
    "description" TEXT,
    "image_urls" TEXT[],
    "image_main" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" TEXT[],
    "store_id" TEXT NOT NULL,

    CONSTRAINT "outfits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_number" INTEGER NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "order_item_details" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "order_by_id" TEXT NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "description" VARCHAR(250),
    "district" VARCHAR(100),
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_email_key" ON "store"("email");

-- CreateIndex
CREATE INDEX "store_category_idx" ON "store"("category");

-- CreateIndex
CREATE INDEX "store_email_idx" ON "store"("email");

-- CreateIndex
CREATE INDEX "outfits_category_idx" ON "outfits"("category");

-- CreateIndex
CREATE INDEX "outfits_code_idx" ON "outfits"("code");

-- CreateIndex
CREATE INDEX "order_order_number_idx" ON "order"("order_number");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "outfits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_order_by_id_fkey" FOREIGN KEY ("order_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
