import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create User
    const user = await prisma.user.upsert({
        where: { email: 'emmanuel@os.com' },
        update: {},
        create: {
            email: 'emmanuel@os.com',
            name: 'Emmanuel Peter',
        },
    })

    // 2. Courses & Topics
    const courses = [
        {
            code: 'COS202', name: 'Computer Programming II', days: 'Mon 11AM–1PM · Tue 2PM–3PM', color: '#8e68c4', category: 'tech',
            topics: [
                'Classes & Objects — definition, instantiation',
                'Encapsulation — access modifiers, getters/setters',
                'Inheritance — parent/child classes, super keyword',
                'Polymorphism — method overriding, overloading',
                'Abstraction — abstract classes, interfaces',
                'Exception Handling — try/catch/finally',
                'File I/O — reading and writing files',
                'Collections — ArrayList, HashMap, Sets',
                'Design Patterns — Singleton, Factory, Observer',
                'OOP Project — full system implementation',
            ]
        },
        {
            code: 'CUACOS216', name: 'Introduction to Graphics', days: 'Mon 2PM–4PM', color: '#c45a8e', category: 'design',
            topics: [
                'Raster vs Vector — pixels, resolution, scalability',
                'Color Models — RGB, CMYK, HSV, hex codes',
                'Coordinate Systems — 2D screen space, transformations',
                'Drawing Primitives — lines, circles, polygons',
                'Transformations — translate, scale, rotate, shear',
                'Clipping & Culling — viewport, scissor test',
                'Lighting Models — ambient, diffuse, specular',
                'Texture Mapping — UV coords, sampling',
                'Rendering Pipeline — vertex → fragment → output',
                'Introduction to OpenGL or WebGL basics',
            ]
        },
        {
            code: 'INS204', name: 'Systems Analysis & Design', days: 'Tue 9AM–11AM', color: '#38bfb0', category: 'tech',
            topics: [
                'SDLC — phases, models, overview',
                'Feasibility Study — technical, economic, operational',
                'Requirements Elicitation — interviews, questionnaires',
                'Functional vs Non-functional requirements',
                'Use Case Diagrams — actors, use cases, relationships',
                'Data Flow Diagrams (DFD) — levels 0, 1, 2',
                'Entity-Relationship Diagrams (ERD)',
                'UML Class Diagrams — classes, associations',
                'System Design — architecture, modules',
                'Agile vs Waterfall — tradeoffs and contexts',
            ]
        },
        {
            code: 'CUACSC214', name: 'Data Visualisation', days: 'Tue 11AM–1PM', color: '#d47a2a', category: 'design',
            topics: [
                'Data types — nominal, ordinal, quantitative',
                'Perceptual principles — pre-attentive attributes',
                "Tufte's rules — data-ink ratio, chartjunk",
                'Chart selection — when to use what',
                'Time series — line charts, area charts',
                'Distributions — histograms, box plots, violin plots',
                'Relationships — scatter plots, correlation',
                'Comparisons — bar charts, grouped, stacked',
                'Geospatial — choropleth, dot maps',
                'Interactive vis — D3.js, Tableau, Plotly intro',
            ]
        },
        {
            code: 'MTH202', name: 'Elementary Differential Equations', days: 'Wed 9AM–11AM', color: '#a06aff', category: 'math',
            topics: [
                'Order & degree of ODE — definitions, classification',
                'Separable equations — method & practice',
                'Linear 1st-order — integrating factor method',
                'Homogeneous equations — substitution method',
                'Exact equations — condition and solution',
                'Bernoulli equations — reduction method',
                '2nd-order linear ODEs — homogeneous solutions',
                'Undetermined coefficients — particular solutions',
                'Variation of parameters — general method',
                'Laplace transforms — definition, table, applications',
            ]
        },
        {
            code: 'GST212', name: 'Philosophy, Logic & Human Existence', days: 'Thu 9AM–11AM', color: '#4a8fd4', category: 'humanities',
            topics: [
                'Introduction to Philosophy — branches, purpose',
                'Epistemology — what is knowledge? JTB theory',
                'Metaphysics — reality, existence, substance',
                'Ethics — moral theories, normative vs descriptive',
                'Logic — deductive vs inductive reasoning',
                'Logical fallacies — ad hominem, straw man, etc.',
                'Syllogisms — categorical, hypothetical, disjunctive',
                'Philosophy of mind — consciousness, dualism',
                'Existentialism — Sartre, Camus, free will',
                'African philosophy — Ubuntu, communalism',
            ]
        },
        {
            code: 'DEP202', name: 'Digital Entrepreneurship III', days: 'Thu 2PM–4PM', color: '#d4a843', category: 'business',
            topics: [
                'Business Model Canvas — all 9 blocks',
                'Value Proposition — customer jobs, pains, gains',
                'Customer discovery — interviews, validation',
                'Product-Market Fit — how to test and measure',
                'Digital marketing — SEO, social, content, ads',
                'Growth hacking — loops, viral coefficients, retention',
                'Lean Startup — build-measure-learn cycle',
                'Fundraising — bootstrapping, angels, pitch decks',
                'Unit economics — CAC, LTV, churn, margins',
                'Legal & IP basics — trademarks, terms, privacy',
            ]
        },
        {
            code: 'CUACOS212', name: 'Probability Theory', days: 'Fri 9AM–11AM', color: '#ff6ad5', category: 'math',
            topics: [
                'Sample spaces & events — definitions, set notation',
                'Axioms of probability — Kolmogorov, properties',
                'Conditional probability — definition, formula',
                "Bayes' theorem — derivation and applications",
                'Independence — pairwise vs mutual independence',
                'Random variables — discrete vs continuous',
                'Expectation & variance — formulas, properties',
                'Binomial distribution — PMF, applications',
                'Normal distribution — PDF, Z-scores, 68-95-99.7',
                'Poisson & Exponential distributions',
            ]
        },
        {
            code: 'IFT212', name: 'Computer Architecture & Organisation', days: 'Fri 11AM–1PM', color: '#3abf6a', category: 'tech',
            topics: [
                'Number systems — binary, hex, octal, conversions',
                'Boolean algebra — laws, De Morgan, simplification',
                'Logic gates — AND, OR, NOT, XOR, NAND, NOR',
                'Combinational circuits — adders, decoders, MUX',
                'Sequential circuits — flip-flops, registers, counters',
                'CPU architecture — ALU, registers, control unit',
                'Instruction Set Architecture (ISA) — RISC vs CISC',
                'Memory hierarchy — cache, RAM, virtual memory',
                'Pipelining — stages, hazards, forwarding',
                'I/O systems — buses, DMA, interrupts',
            ]
        },
    ]

    for (let i = 0; i < courses.length; i++) {
        const c = courses[i];
        const course = await prisma.course.upsert({
            where: { code: c.code },
            update: {},
            create: {
                code: c.code,
                name: c.name,
                days: c.days,
                color: c.color,
                category: c.category,
            },
        })

        for (let j = 0; j < c.topics.length; j++) {
            await prisma.courseTopic.create({
                data: {
                    courseId: course.id,
                    order: j + 1,
                    title: c.topics[j],
                }
            })
        }
    }

    // 3. Habits
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
        await prisma.habit.create({
            data: h
        })
    }

    // 4. Goals & Phases
    const goals = [
        {
            icon: '🎓', title: 'FIRST-CLASS GRADES', color: '#4a8fd4', order: 1,
            tagline: 'Lectures are revision. You already know it when you walk in.',
            phases: [
                { t: 'Self-study every course before lectures', d: 'Use YouTube (Neso Academy, Khan Academy, Professor Leonard). Read slides/textbooks the day before. When you enter that lecture hall, you already know 70% of it.', o: 1 },
                { t: 'Cornell note system + 24hr review', d: 'During lectures: capture key points only. Within 24 hours: rewrite in Cornell format — cue column, notes, summary. This alone doubles retention.', o: 2 },
                { t: 'Anki spaced repetition — daily', d: '15 cards every 3AM session. Build a deck for each course. Test before looking. Review what you get wrong twice.', o: 3 },
                { t: 'Past questions — every course', d: 'Collect past exam papers for all 9 courses. Do them timed. Map the question patterns. Examiners repeat. Exploit that.', o: 4 },
                { t: 'Teach-back method', d: 'After every topic: explain it aloud as if teaching. Record yourself if needed. If you can\'t explain it simply — you don\'t actually know it yet.', o: 5 },
            ]
        },
        {
            icon: '💻', title: 'PROGRAMMING MASTERY', color: '#8e68c4', order: 2,
            tagline: 'Not just writing code. Engineering systems that actually work.',
            phases: [
                { t: 'OOP mastery — 3 complete projects', d: 'Build: (1) a Bank Account System, (2) a Student Grade Manager, (3) a simple CLI inventory tool. All in pure OOP. Real classes, inheritance, interfaces. No tutorials — spec it yourself.', o: 1 },
                { t: 'Data structures & algorithms', d: 'Arrays → Linked Lists → Stacks → Queues → Trees → HashMaps. Then sorting: bubble, merge, quick. Then binary search. One structure per week. LeetCode Easy to confirm understanding.', o: 2 },
                { t: 'LeetCode daily streak', d: '3:30AM: one LeetCode problem. Every day. Don\'t skip. Track your streak. After solving, always read the discussion for a better solution — learn the pattern, not just the answer.', o: 3 },
                { t: 'One real project per month', d: 'Not a tutorial. A real idea. Solve a real problem. Push to GitHub with a clean README. By end of semester: 4 live projects. Portfolio building starts now.', o: 4 },
                { t: 'System design thinking', d: 'Before coding anything: draw it. What are the classes? What are the relationships? How does data flow? Architects think before they build.', o: 5 },
            ]
        },
        {
            icon: '📈', title: 'TRADING & FINANCIAL INDEPENDENCE', color: '#d94f4f', order: 3,
            tagline: 'Logic over emotion. Structured execution. Wealth through discipline.',
            phases: [
                { t: 'Market structure — daily chart marking', d: 'Every day: open TradingView, mark HH/HL/LH/LL on 3 different pairs. Do this for 30 days straight before thinking about entries. Structure first. Always.', o: 1 },
                { t: 'BOS identification mastery', d: 'Practice identifying real Break of Structure vs fakeouts on historical charts. Log 20 examples with explanations. No live trades until BOS recognition is automatic.', o: 2 },
                { t: 'Multi-timeframe analysis system', d: 'Weekly (trend direction) → Daily (structure) → 4H (setup forming) → 1H (entry signal). Top-down only. Never trade against the weekly trend.', o: 3 },
                { t: 'Risk management — 1% rule', d: 'Max 1-2% risk per trade. Set stop loss BEFORE entry — never after. R:R minimum 1:2. Track every trade in a journal. No exceptions. This is survival.', o: 4 },
                { t: '90-day demo discipline → live', d: 'Trade demo with REAL discipline — same rules as live. Journal every trade: entry reason, SL, TP, emotion, outcome, lesson. 60%+ win rate × 90 days = permission to go live.', o: 5 },
            ]
        },
        {
            icon: '🏋️', title: 'ATHLETIC & PHYSIQUE EVOLUTION', color: '#3abf6a', order: 4,
            tagline: 'Athletic. Defined. Flexible. Your body reflects your internal discipline.',
            phases: [
                { t: 'Calisthenics — 3x/week structured', d: 'Mon: Push (push-ups, pike push-ups, dips) · Wed: Pull (rows, scapular pulls, towel pulls) · Fri: Full circuit + core. 4 sets each. Track reps every session. Progressive overload matters.', o: 1 },
                { t: 'Daily flexibility — 10 minutes', d: 'Every single day after waking: hamstrings, hip flexors, thoracic spine, shoulder circles. Goal: touch toes in 6 weeks. Better posture. Less stiffness.', o: 2 },
                { t: 'Basketball IQ + defensive discipline', d: 'Film one game per week (or ask brother to observe). Focus: defensive stance, not reaching, guiding baseline, attacking top foot. Pick one weakness to fix per week.', o: 3 },
                { t: 'Nutrition — fuel the machine', d: 'Protein every meal (eggs, chicken, beans). Complex carbs before training. 3L water daily minimum. No skipping breakfast. Eat within 30 mins of waking. Sleep = growth hormone.', o: 4 },
                { t: '6-month physique target', d: 'Athletic V-taper. Visible definition without bulk. Milestones: 30 push-ups, 10 pull-ups, 60s plank, toe touch, straight posture at all times.', o: 5 },
            ]
        },
        {
            icon: '🤝', title: 'SOCIAL COMPOSURE & CONFIDENCE', color: '#38bfb0', order: 5,
            tagline: 'Quiet capability. The room feels you before you speak.',
            phases: [
                { t: 'The pause — 2 seconds before every reaction', d: 'Every response, every laugh, every reply — pause 2 seconds first. That gap is where composure lives. Practice this in EVERY social interaction. It will feel unnatural at first. Good.', o: 1 },
                { t: 'Speaking to girls — confident & natural', d: 'No overthinking. No performing. Just genuine curiosity. Ask one real question. Listen fully. Respond slowly. Eye contact without staring. Smile with control. Start simple: compliment something specific and walk away. No lingering.', o: 2 },
                { t: 'Boundary setting — calm and firm', d: 'Identify 3 behaviors you currently tolerate that disrespect your time or energy. Set boundaries this week. State them once, clearly, without explanation. Then hold them silently.', o: 3 },
                { t: 'Presence — speak less, mean more', d: 'Cut your word count in social settings by half. Silence is not awkward when you\'re comfortable in it. The person who speaks least but most precisely is always the most respected.', o: 4 },
                { t: 'Manipulation detection + ethical influence', d: 'Study: guilt tripping, false urgency, love bombing, DARVO. Notice them in real interactions. Never use them. Instead: lead by example, speak with clarity, be consistent. That\'s real influence.', o: 5 },
            ]
        },
        {
            icon: '✨', title: 'SPIRITUAL ALIGNMENT', color: '#c9962e', order: 6,
            tagline: 'Not ritual. Anchor. Discipline flows from here.',
            phases: [
                { t: 'Manna app — 3AM, every day, no exceptions', d: 'Before study. Before code. Before anything. This is your first action. It sets the tone. Miss it and the day starts off-center.', o: 1 },
                { t: 'Specific prayer — name your goals', d: 'Don\'t just pray generally. Name it: "I\'m building discipline, help me hold this schedule." "I\'m working toward first class, give me understanding." Specific faith attracts specific results.', o: 2 },
                { t: 'Consistency over intensity', d: 'One verse. One genuine minute of prayer. Every day. That is more powerful than a 2-hour Sunday session with nothing in between. God rewards the daily show-up.', o: 3 },
                { t: 'Weekly alignment audit — Sunday', d: 'Every Sunday morning: Are my actions matching my values? Am I becoming who I prayed to become? Honest answer. No guilt — just adjustment.', o: 4 },
            ]
        },
    ]

    for (const g of goals) {
        const goal = await prisma.goal.create({
            data: {
                title: g.title,
                tagline: g.tagline,
                icon: g.icon,
                color: g.color || '#c9962e',
                order: g.order,
            }
        })

        for (const p of g.phases) {
            await prisma.goalPhase.create({
                data: {
                    goalId: goal.id,
                    order: p.o,
                    title: p.t,
                    detail: p.d,
                }
            })
        }
    }

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
