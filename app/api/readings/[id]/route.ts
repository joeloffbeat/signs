export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'

async function getUserId(email: string) {
  const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single()
  return data?.id ?? null
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const userId = await getUserId(session.user.email)
  if (!userId) return NextResponse.json(null, { status: 401 })

  await supabaseAdmin.from('readings').delete().eq('id', params.id).eq('user_id', userId)
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const userId = await getUserId(session.user.email)
  if (!userId) return NextResponse.json(null, { status: 401 })

  const { notes } = await req.json()
  const { data } = await supabaseAdmin
    .from('readings').update({ notes }).eq('id', params.id).eq('user_id', userId).select().single()

  return NextResponse.json(data)
}
