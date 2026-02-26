const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://dqxlzeegaflkwzbmezgn.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeGx6ZWVnYWZsa3d6Ym1lemduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTQxNDQsImV4cCI6MjA4NzI3MDE0NH0.du0OCWd4TwSG05dpXS-2WV79zzeeTpNsQa3cedmHhM4"

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    try {
        const { data, error } = await supabase.from('User').select('count', { count: 'exact', head: true })
        if (error) throw error
        console.log(`Supabase API connection successful. Head count: ${data}`)
    } catch (error) {
        console.error('Supabase API connection failed:', error)
    }
}

main()
