const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgres://postgres.dqxlzeegaflkwzbmezgn:CodeCraft2008%40%23%24@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
        }
    }
})

async function main() {
    try {
        const userCount = await prisma.user.count()
        console.log(`Direct Database connection successful. User count: ${userCount}`)
    } catch (error) {
        console.error('Direct Database connection failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
