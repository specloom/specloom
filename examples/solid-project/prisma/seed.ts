import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean all tables (child tables first via join tables, then parents with cascade)
  await prisma.hasManyLink.deleteMany();
  await prisma.manyToManyLink.deleteMany();
  await prisma.optionSourceExample.deleteMany();
  await prisma.belongsToRelationExample.deleteMany();
  await prisma.hasManyRelationExample.deleteMany();
  await prisma.manyToManyRelationExample.deleteMany();
  await prisma.nestedOneInlineExample.deleteMany();  // cascades Address
  await prisma.nestedManyTableExample.deleteMany();   // cascades OrderLine
  await prisma.nestedManyCardsExample.deleteMany();   // cascades AttachmentCard
  await prisma.department.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.member.deleteMany();
  await prisma.basicScalarExample.deleteMany();
  await prisma.uiMetadataExample.deleteMany();
  await prisma.lifecycleFlagsExample.deleteMany();
  await prisma.fieldValidationExample.deleteMany();
  await prisma.conditionalValidationExample.deleteMany();
  await prisma.modelRulesExample.deleteMany();
  await prisma.filterOperatorsExample.deleteMany();
  await prisma.namedFiltersExample.deleteMany();
  await prisma.staticOptionsExample.deleteMany();
  await prisma.pageActionCatalog.deleteMany();

  // ─── Shared Resources ────────────────────────────────────

  const departments = await Promise.all(
    ["Engineering", "Sales", "Marketing", "HR", "Finance"].map((name) =>
      prisma.department.create({ data: { name } }),
    ),
  );

  const tags = await Promise.all(
    [
      { name: "Frontend", color: "#3b82f6" },
      { name: "Backend", color: "#22c55e" },
      { name: "DevOps", color: "#f59e0b" },
      { name: "Design", color: "#8b5cf6" },
      { name: "Security", color: "#ef4444" },
    ].map((d) => prisma.tag.create({ data: d })),
  );

  const members = await Promise.all(
    [
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Smith", email: "bob@example.com" },
      { name: "Charlie Brown", email: "charlie@example.com" },
      { name: "Diana Prince", email: "diana@example.com" },
      { name: "Eve Davis", email: "eve@example.com" },
    ].map((d) => prisma.member.create({ data: d })),
  );

  // ─── 10-basic ─────────────────────────────────────────────

  for (let i = 0; i < 8; i++) {
    await prisma.basicScalarExample.create({
      data: {
        title: `Sample Item ${i + 1}`,
        count: (i + 1) * 10,
        enabled: i % 2 === 0,
        createdAt: new Date(2025, i % 12, i + 1),
      },
    });
  }

  const statuses = ["draft", "published", "archived"];
  for (let i = 0; i < 8; i++) {
    await prisma.uiMetadataExample.create({
      data: {
        headline: `Article ${i + 1}`,
        slug: `article-${i + 1}`,
        summary: i % 3 === 0 ? null : `Summary for article ${i + 1}`,
        status: statuses[i % 3],
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    await prisma.lifecycleFlagsExample.create({
      data: {
        email: `user${i + 1}@example.com`,
        password: "hashed_password",
        displayName: `User ${i + 1}`,
        internalMemo: i % 2 === 0 ? `Internal note ${i + 1}` : null,
      },
    });
  }

  // ─── 20-validation ────────────────────────────────────────

  for (let i = 0; i < 6; i++) {
    await prisma.fieldValidationExample.create({
      data: {
        name: `Validated Item ${i + 1}`,
        email: i % 2 === 0 ? `item${i + 1}@example.com` : null,
        age: i % 3 === 0 ? null : 20 + i * 5,
        tags: JSON.stringify(["tag-a", "tag-b"].slice(0, (i % 2) + 1)),
      },
    });
  }

  const condStatuses = ["active", "suspended", "archived"];
  for (let i = 0; i < 6; i++) {
    await prisma.conditionalValidationExample.create({
      data: {
        status: condStatuses[i % 3],
        reason: i % 3 === 1 ? `Reason for suspension ${i + 1}` : null,
        password: i < 3 ? "secret123" : null,
        passwordConfirm: i < 3 ? "secret123" : null,
        adminNote: i % 2 === 0 ? `Admin note ${i + 1}` : null,
        archiveNote: i % 3 === 2 ? `Archive reason ${i + 1}` : null,
      },
    });
  }

  const ruleStatuses = ["active", "inactive", "pending"];
  for (let i = 0; i < 6; i++) {
    await prisma.modelRulesExample.create({
      data: {
        name: `Rule ${i + 1}`,
        status: ruleStatuses[i % 3],
        email: `rule${i + 1}@example.com`,
        phone: i % 2 === 0 ? `090-1234-${String(i + 1).padStart(4, "0")}` : null,
        slackId: i % 3 === 0 ? `U${String(i + 1).padStart(6, "0")}` : null,
        reason: i % 3 === 1 ? `Inactive reason ${i + 1}` : null,
        startDate: new Date(2025, i, 1),
        endDate: i % 2 === 0 ? new Date(2025, i + 3, 1) : null,
      },
    });
  }

  // ─── 30-filters-options ───────────────────────────────────

  const filterStatuses = ["open", "in_progress", "closed", "blocked"];
  for (let i = 0; i < 10; i++) {
    await prisma.filterOperatorsExample.create({
      data: {
        title: `Task ${i + 1}`,
        status: filterStatuses[i % 4],
        createdAt: new Date(2025, i % 12, (i + 1) * 2),
      },
    });
  }

  const categories = ["blog", "news", "tutorial", "announcement"];
  for (let i = 0; i < 10; i++) {
    await prisma.namedFiltersExample.create({
      data: {
        title: `Post ${i + 1}`,
        ownerId: i % 3 === 0 ? members[i % 5].id : null,
        status: filterStatuses[i % 4],
        category: categories[i % 4],
        createdAt: new Date(2025, i % 12, i + 1),
      },
    });
  }

  for (let i = 0; i < 6; i++) {
    await prisma.staticOptionsExample.create({
      data: {
        title: `Option Item ${i + 1}`,
        priority: (i % 3) + 1,
        published: i % 2 === 0,
      },
    });
  }

  for (let i = 0; i < 6; i++) {
    await prisma.optionSourceExample.create({
      data: {
        title: `Source Item ${i + 1}`,
        departmentId: departments[i % 5].id,
        reviewerId: i % 2 === 0 ? members[i % 5].id : null,
      },
    });
  }

  // ─── 40-relations ─────────────────────────────────────────

  for (let i = 0; i < 6; i++) {
    await prisma.belongsToRelationExample.create({
      data: {
        name: `Employee ${i + 1}`,
        departmentId: departments[i % 5].id,
      },
    });
  }

  for (let i = 0; i < 4; i++) {
    const example = await prisma.hasManyRelationExample.create({
      data: { name: `Team ${i + 1}` },
    });
    const memberSlice = members.slice(i, i + 2);
    for (const m of memberSlice) {
      await prisma.hasManyLink.create({
        data: { exampleId: example.id, memberId: m.id },
      });
    }
  }

  for (let i = 0; i < 4; i++) {
    const example = await prisma.manyToManyRelationExample.create({
      data: { title: `Project ${i + 1}` },
    });
    const tagSlice = tags.slice(i, i + 3);
    for (const t of tagSlice) {
      await prisma.manyToManyLink.create({
        data: { exampleId: example.id, tagId: t.id },
      });
    }
  }

  // ─── 50-nested ────────────────────────────────────────────

  const cities = ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Sapporo"];
  for (let i = 0; i < 5; i++) {
    await prisma.nestedOneInlineExample.create({
      data: {
        name: `Customer ${i + 1}`,
        shippingAddress: {
          create: {
            line1: `${100 + i} Main St`,
            city: cities[i],
            postalCode: `${100 + i}-0001`,
          },
        },
      },
    });
  }

  for (let i = 0; i < 4; i++) {
    await prisma.nestedManyTableExample.create({
      data: {
        orderNumber: `ORD-${String(1000 + i)}`,
        lineItems: {
          create: Array.from({ length: 3 }, (_, j) => ({
            sku: `SKU-${1000 + i * 10 + j}`,
            name: `Product ${i * 10 + j + 1}`,
            quantity: (j + 1) * 2,
          })),
        },
      },
    });
  }

  for (let i = 0; i < 4; i++) {
    await prisma.nestedManyCardsExample.create({
      data: {
        title: `Document Set ${i + 1}`,
        attachments: {
          create: Array.from({ length: 2 }, (_, j) => ({
            title: `Attachment ${i * 10 + j + 1}`,
            url: `https://example.com/files/doc-${i * 10 + j + 1}.pdf`,
          })),
        },
      },
    });
  }

  // ─── 60-actions ───────────────────────────────────────────

  const catalogStatuses = ["active", "suspended", "archived"];
  for (let i = 0; i < 8; i++) {
    await prisma.pageActionCatalog.create({
      data: {
        name: `Catalog ${i + 1}`,
        status: catalogStatuses[i % 3],
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
