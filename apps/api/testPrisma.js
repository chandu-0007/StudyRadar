const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const where = {};
  where.subjectId = "40184403-bb74-4fec-bf29-caca687c797f";
  // where.status = ''; // simulate what `filters.status = ''` evaluates to in ResourceFeed

  if ('') where.status = ''; // This would be skipped in API logic

  const result = await prisma.resource.findMany({
    where,
    skip: 0,
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      subject: { select: { name: true, code: true } },
      uploadedBy: { select: { username: true, role: true } }
    }
  });
  console.log("Found:", result.length);
  console.log("Item:", JSON.stringify(result[0], null, 2));
}

test().finally(() => prisma.$disconnect());
