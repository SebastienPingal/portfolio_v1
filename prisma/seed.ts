import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import yaml from 'yaml';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = join(__dirname, 'seedData.yaml');
  const seedDataContent = fs.readFileSync(seedDataPath, 'utf8');
  const seedData = yaml.parse(seedDataContent);

  // Seed stacks first, checking for existence by title
  for (const stack of seedData.stacks) {
    const existingStack = await prisma.stack.findFirst({
      where: { title: stack.title },
    });
    if (!existingStack) {
      await prisma.stack.create({
        data: stack,
      });
    }
  }

  // Seed posts, checking for existence by slug
  for (const post of seedData.posts) {
    const existingPost = await prisma.post.findFirst({
      where: { slug: post.slug },
    });
    if (!existingPost) {
      const connectedStacks = post.stacks ? post.stacks.map(stackTitle => ({
        title: stackTitle,
      })) : [];

      await prisma.post.create({
        data: {
          ...post,
          stacks: connectedStacks.length ? { connect: connectedStacks } : undefined,
        },
      });
    }
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });