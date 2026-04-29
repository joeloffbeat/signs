export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const { data } = await supabaseAdmin
    .from('users')
    .select('id, name, birth_date, birth_time, birth_place')
    .eq('email', session.user.email)
    .single()

  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const { name, birth_date, birth_time, birth_place } = await req.json()

  const { data } = await supabaseAdmin
    .from('users')
    .update({ name, birth_date, birth_time, birth_place })
    .eq('email', session.user.email)
    .select('id, name, birth_date, birth_time, birth_place')
    .single()

  return NextResponse.json(data)
}
