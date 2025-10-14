import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection with raw query
    const rows = await prisma.$queryRawUnsafe('select now()')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: rows,
      data: rows
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 })
  }
}
