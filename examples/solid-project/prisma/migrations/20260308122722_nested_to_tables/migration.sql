/*
  Warnings:

  - You are about to drop the column `attachments` on the `NestedManyCardsExample` table. All the data in the column will be lost.
  - You are about to drop the column `lineItems` on the `NestedManyTableExample` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddress` on the `NestedOneInlineExample` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "line1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "exampleId" TEXT NOT NULL,
    CONSTRAINT "Address_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "NestedOneInlineExample" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exampleId" TEXT NOT NULL,
    CONSTRAINT "OrderLine_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "NestedManyTableExample" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AttachmentCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "exampleId" TEXT NOT NULL,
    CONSTRAINT "AttachmentCard_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "NestedManyCardsExample" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NestedManyCardsExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);
INSERT INTO "new_NestedManyCardsExample" ("id", "title") SELECT "id", "title" FROM "NestedManyCardsExample";
DROP TABLE "NestedManyCardsExample";
ALTER TABLE "new_NestedManyCardsExample" RENAME TO "NestedManyCardsExample";
CREATE TABLE "new_NestedManyTableExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL
);
INSERT INTO "new_NestedManyTableExample" ("id", "orderNumber") SELECT "id", "orderNumber" FROM "NestedManyTableExample";
DROP TABLE "NestedManyTableExample";
ALTER TABLE "new_NestedManyTableExample" RENAME TO "NestedManyTableExample";
CREATE TABLE "new_NestedOneInlineExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_NestedOneInlineExample" ("id", "name") SELECT "id", "name" FROM "NestedOneInlineExample";
DROP TABLE "NestedOneInlineExample";
ALTER TABLE "new_NestedOneInlineExample" RENAME TO "NestedOneInlineExample";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Address_exampleId_key" ON "Address"("exampleId");
