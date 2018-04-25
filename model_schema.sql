BEGIN;
--
-- Create model Goods
--
CREATE TABLE "item_list_goods" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(256) NOT NULL, "genre2" varchar(128) NOT NULL, "date" integer unsigned NOT NULL, "start_time" integer unsigned NOT NULL, "end_time" integer unsigned NOT NULL, "cate1" varchar(128) NULL, "url" varchar(2048) NOT NULL, "img" varchar(2048) NOT NULL, "price" integer unsigned NOT NULL, "org_price" integer unsigned NOT NULL);
COMMIT;
