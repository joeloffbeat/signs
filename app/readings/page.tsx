export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import ReadingsClient from './ReadingsClient'

export default async function ReadingsPage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  let { data: dbUser } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single()

  if (!dbUser) {
    const { data: created } = await supabaseAdmin
      .from('users')
      .insert({ email: session.user.email, name: session.user.name ?? session.user.email })
      .select('id')
      .single()
    dbUser = created
  }

  const { data: readings } = dbUser
    ? await supabaseAdmin
        .from('readings')
        .select('*')
        .eq('user_id', dbUser.id)
        .order('created_at', { ascending: false })
    : { data: null }

  return (
    <>
      <TopNav />
      <ReadingsClient readings={readings ?? []} userId={dbUser?.id ?? ''} />
    </>
  )
}
