const { PrismaClient } = require('@prisma/client')
const { writeFileSync } = require('fs')
const yaml = require('yaml')

const prisma = new PrismaClient()

async function exportData() {
  const posts = await prisma.post.findMany({
    include: {
      stacks: true,
    },
  })
  const stacks = await prisma.stack.findMany() 
  // Add more queries for other models as needed

  const data = { posts, stacks }
  const yamlData = yaml.stringify(data)
  writeFileSync('seedData.yaml', yamlData)
}

exportData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })