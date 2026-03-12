const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rs = await prisma.resource.findMany({ include: { subject: true } });
  console.log("Resources:", JSON.stringify(rs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
