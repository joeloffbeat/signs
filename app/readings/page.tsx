export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import ReadingsClient from './ReadingsClient'

export default async function ReadingsPage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/login')

  const { data: dbUser } = await supabaseAdmin
    .from('users').select('id').eq('email', session.user.email).single()
  if (!dbUser) redirect('/login')

  const { data: readings } = await supabaseAdmin
    .from('readings')
    .select('*')
    .eq('user_id', dbUser.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <TopNav />
      <ReadingsClient readings={readings ?? []} userId={dbUser.id} />
    </>
  )
}
