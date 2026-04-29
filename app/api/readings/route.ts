export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single()
  if (!user) return NextResponse.json(null, { status: 401 })

  const { type, data } = await req.json()

  const { data: reading, error } = await supabaseAdmin
    .from('readings')
    .insert({ user_id: user.id, type, data })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(reading)
}
