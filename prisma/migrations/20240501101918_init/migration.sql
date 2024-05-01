-- AlterTable
CREATE SEQUENCE order_order_number_seq;
ALTER TABLE "order" ALTER COLUMN "order_number" SET DEFAULT nextval('order_order_number_seq');
ALTER SEQUENCE order_order_number_seq OWNED BY "order"."order_number";
