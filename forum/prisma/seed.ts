import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  if ((await prisma.board.count()) === 0) {
    await prisma.board.createMany({
      data: [
        {
          name: "General Discussion",
          description: "General discussion topics",
        },
        {
          name: "Requests for Advice",
          description: "Get advice about dealing with abuse",
        },
      ],
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
