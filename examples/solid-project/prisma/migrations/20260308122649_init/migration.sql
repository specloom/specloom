-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BasicScalarExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UiMetadataExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "headline" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LifecycleFlagsExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "internalMemo" TEXT
);

-- CreateTable
CREATE TABLE "FieldValidationExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER,
    "tags" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "ConditionalValidationExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "password" TEXT,
    "passwordConfirm" TEXT,
    "adminNote" TEXT,
    "archiveNote" TEXT
);

-- CreateTable
CREATE TABLE "ModelRulesExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "slackId" TEXT,
    "reason" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME
);

-- CreateTable
CREATE TABLE "FilterOperatorsExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NamedFiltersExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "ownerId" TEXT,
    "status" TEXT,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StaticOptionsExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "OptionSourceExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "departmentId" TEXT,
    "reviewerId" TEXT,
    CONSTRAINT "OptionSourceExample_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OptionSourceExample_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Member" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BelongsToRelationExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    CONSTRAINT "BelongsToRelationExample_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HasManyRelationExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HasManyLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exampleId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    CONSTRAINT "HasManyLink_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "HasManyRelationExample" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HasManyLink_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ManyToManyRelationExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ManyToManyLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exampleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "ManyToManyLink_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "ManyToManyRelationExample" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ManyToManyLink_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NestedOneInlineExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "NestedManyTableExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "lineItems" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "NestedManyCardsExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "attachments" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "PageActionCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HasManyLink_exampleId_memberId_key" ON "HasManyLink"("exampleId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ManyToManyLink_exampleId_tagId_key" ON "ManyToManyLink"("exampleId", "tagId");
