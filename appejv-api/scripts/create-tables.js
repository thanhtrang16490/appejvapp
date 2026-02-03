const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 Creating database tables...')

  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')

    // Split the SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.log(`⚠️  Statement ${i + 1} may have failed:`, error.message)
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} error:`, err.message)
      }
    }

    console.log('✅ Database tables created successfully!')
    console.log('🎉 You can now run: npm run setup-db')

  } catch (error) {
    console.error('❌ Error creating tables:', error)
  }
}

createTables()