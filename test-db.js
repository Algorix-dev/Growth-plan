const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("SUCCESS: Connected to database");
    } catch (e) {
        console.log("ERROR OUTPUT:");
        console.log(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
