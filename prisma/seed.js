const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function quarterLabel(date = new Date()) {
  const year = date.getFullYear();
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `${year} Q${q}`;
}

function quarterRange(date = new Date()) {
  const year = date.getFullYear();
  const q = Math.floor(date.getMonth() / 3) + 1;
  const start = new Date(year, (q - 1) * 3, 1, 0, 0, 0);
  const end = new Date(year, q * 3, 0, 23, 59, 59);
  return { start, end };
}

async function upsertSeason() {
  const { start, end } = quarterRange(new Date());
  const name = quarterLabel(new Date());
  const existing = await prisma.season.findFirst({
    where: { name },
  });
  if (existing) return existing;
  return prisma.season.create({
    data: {
      name,
      startDate: start,
      endDate: end,
      status: "ACTIVE"
    }
  });
}

async function main() {
  await upsertSeason();

  // Demo players (you can delete and create your real ones in the app)
  const demo = [
    { name: "Marc", pin: "1111", division: "FIRST" },
    { name: "Joan", pin: "2222", division: "FIRST" },
    { name: "Pau", pin: "3333", division: "FIRST" },
    { name: "Nil", pin: "4444", division: "SECOND" },
    { name: "Oriol", pin: "5555", division: "SECOND" },
    { name: "Quim", pin: "6666", division: "SECOND" }
  ];

  for (const p of demo) {
    const pinHash = await bcrypt.hash(p.pin, 10);
    await prisma.player.upsert({
      where: { name: p.name },
      update: { pinHash, division: p.division, isAdmin: true, active: true },
      create: { name: p.name, pinHash, division: p.division, isAdmin: true, active: true }
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
