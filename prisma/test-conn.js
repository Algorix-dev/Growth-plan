const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log("Connecting to DB (JS)...")
    try {
        const userCount = await prisma.user.count()
        console.log(`Connection successful. User count: ${userCount}`)
    } catch (e) {
        console.error("Connection failed in JS:", e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
