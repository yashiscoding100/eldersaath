const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const user = await prisma.user.findFirst()
    console.log("User:", user)
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isBlocked: true, blockMessage: "Test" }
      })
      console.log("Update successful")
    }
  } catch (e) {
    console.error("Prisma error:", e)
  }
}

main()
