// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const plans = [
    { slug: "starter", title: "Starter Growth", usdPrice: 299 },
    { slug: "performance", title: "Performance Growth", usdPrice: 599 },
    { slug: "automation", title: "Automation Growth", usdPrice: 999 },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { slug: p.slug },
      update: { title: p.title, usdPrice: p.usdPrice },
      create: p,
    });
  }

  console.log("Seeded plans");
}
main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
