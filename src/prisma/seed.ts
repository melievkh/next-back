import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const stores = JSON.parse(
    readFileSync('src/prisma/seeds/stores.json', 'utf-8'),
  );
  const outfits = JSON.parse(
    readFileSync('src/prisma/seeds/outfits.json', 'utf-8'),
  );

  for (const store of stores) {
    await prisma.store.create({
      data: {
        ...store,
        password: await bcrypt.hash(store.password, 12),
      },
    });
  }

  for (const outfit of outfits) {
    await prisma.outfits.create({
      data: outfit,
    });
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
