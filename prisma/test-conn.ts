import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Connecting to DB...")
    const userCount = await prisma.user.count()
    console.log(`Connection successful. User count: ${userCount}`)
}

main()
    .catch(e => console.error("Connection failed:", e))
    .finally(() => prisma.$disconnect())
