const { ResourceService } = require('./build/services/resourceService') || require('./src/services/resourceService');
const { PrismaClient } = require('@prisma/client');

async function test() {
  const result = await new PrismaClient().resource.findMany({
    where: { subjectId: "40184403-bb74-4fec-bf29-caca687c797f" }
  });
  console.log(result.length);
}
test();
