const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding process initiated...')

    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email: 'emmanuel@os.com' },
        update: {},
        create: {
            email: 'emmanuel@os.com',
            name: 'Emmanuel Peter',
        },
    })
    console.log('User Emmanuel ready:', user.id)

    // 2. Courses - using labels/codes as IDs for consistency
    const courses = [
        { code: 'COS202', name: 'Computer Programming II', days: 'Mon 11AM–1PM · Tue 2PM–3PM', color: '#8e68c4', category: 'tech' },
        { code: 'CUACOS216', name: 'Introduction to Graphics', days: 'Mon 2PM–4PM', color: '#c45a8e', category: 'design' },
        { code: 'INS204', name: 'Systems Analysis & Design', days: 'Tue 9AM–11AM', color: '#38bfb0', category: 'tech' },
        { code: 'CUACSC214', name: 'Data Visualisation', days: 'Tue 11AM–1PM', color: '#d47a2a', category: 'design' },
        { code: 'MTH202', name: 'Elementary Differential Equations', days: 'Wed 9AM–11AM', color: '#a06aff', category: 'math' },
        { code: 'GST212', name: 'Philosophy, Logic & Human Existence', days: 'Thu 9AM–11AM', color: '#4a8fd4', category: 'humanities' },
        { code: 'DEP202', name: 'Digital Entrepreneurship III', days: 'Thu 2PM–4PM', color: '#d4a843', category: 'business' },
        { code: 'CUACOS212', name: 'Probability Theory', days: 'Fri 9AM–11AM', color: '#ff6ad5', category: 'math' },
        { code: 'IFT212', name: 'Computer Architecture & Organisation', days: 'Fri 11AM–1PM', color: '#3abf6a', category: 'tech' },
    ]

    for (const c of courses) {
        await prisma.course.upsert({
            where: { code: c.code },
            update: { name: c.name, days: c.days, color: c.color, category: c.category },
            create: { id: c.code, ...c }
        })
    }
    console.log('Courses seeded.')

    // 3. Habits - Critical for the "Ticking 5 tasks" issue
    const habits = [
        { label: '3AM Wake-up', category: 'Foundation', color: '#c9962e', order: 1 },
        { label: 'Manna Devotion', category: 'Spiritual', color: '#c9962e', order: 2 },
        { label: 'Morning Prayer', category: 'Spiritual', color: '#c9962e', order: 3 },
        { label: 'Academic Self-Study (2+ hrs)', category: 'Grades', color: '#4a8fd4', order: 4 },
        { label: 'LeetCode / Coding Session', category: 'Programming', color: '#8e68c4', order: 5 },
        { label: 'Calisthenics Training', category: 'Physical', color: '#3abf6a', order: 6 },
        { label: 'Flexibility / Stretching', category: 'Physical', color: '#3abf6a', order: 7 },
        { label: 'Trading Chart Study', category: 'Trading', color: '#d94f4f', order: 8 },
        { label: 'Trade Journal Updated', category: 'Trading', color: '#d94f4f', order: 9 },
        { label: 'Grooming & Style Check', category: 'Identity', color: '#c45a8e', order: 10 },
        { label: 'Posture Check (hourly)', category: 'Identity', color: '#c45a8e', order: 11 },
        { label: 'Daily Review Written', category: 'Discipline', color: '#e8b84b', order: 12 },
        { label: '9PM Sleep — no exceptions', category: 'Foundation', color: '#c9962e', order: 13 },
    ]

    for (const h of habits) {
        await prisma.habit.upsert({
            where: { id: h.label },
            update: { category: h.category, color: h.color, order: h.order },
            create: { id: h.label, ...h }
        })
    }
    console.log('Habits seeded.')

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error('Seeding error:', e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
