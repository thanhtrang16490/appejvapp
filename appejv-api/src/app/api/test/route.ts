import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Simple test - try to query roles table
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Database tables not found',
        error: error.message,
        instructions: [
          '1. Go to Supabase Dashboard → SQL Editor',
          '2. Copy and paste the content of database/setup-manual.sql',
          '3. Click Run to create all tables',
          '4. Then run: npm run setup-db'
        ]
      }, { status: 400 })
    }

    // Test other tables
    const tests = await Promise.allSettled([
      supabaseAdmin.from('sectors').select('*').limit(1),
      supabaseAdmin.from('products').select('*').limit(1),
      supabaseAdmin.from('contents').select('*').limit(1),
      supabaseAdmin.from('users').select('*').limit(1)
    ])

    const results = {
      roles: tests[0].status === 'fulfilled',
      sectors: tests[1].status === 'fulfilled', 
      products: tests[2].status === 'fulfilled',
      contents: tests[3].status === 'fulfilled',
      users: tests[4].status === 'fulfilled'
    }

    const allTablesExist = Object.values(results).every(Boolean)

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist ? 'All database tables are ready!' : 'Some tables are missing',
      tables: results,
      nextSteps: allTablesExist ? [
        'Database is ready!',
        'You can now use the admin panel at http://localhost:3001',
        'Login with: admin@appejv.vn / appejv2024'
      ] : [
        'Run the SQL script in Supabase Dashboard',
        'Then run: npm run setup-db'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}