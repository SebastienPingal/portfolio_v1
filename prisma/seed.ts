const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const prisma = new PrismaClient()

async function main() {
  // Load stacks from YAML file
  const stacksYamlPath = path.join(__dirname, 'stacks.yaml')
  const stacksData = yaml.load(fs.readFileSync(stacksYamlPath, 'utf8')) as any[]

  // Seed stacks
  for (const stack of stacksData) {
    const existingStack = await prisma.stack.findUnique({
      where: { title: stack.title },
    })

    if (!existingStack) {
      await prisma.stack.create({
        data: stack,
      })
      console.log(`Stack ${stack.title} created`)
    } else {
      console.log(`Stack ${stack.title} already exists`)
    }
  }

  // Add more seeding logic as needed
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })