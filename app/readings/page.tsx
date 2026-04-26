import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import ReadingsClient from './ReadingsClient'

export default async function ReadingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { data: readings } = await supabaseAdmin
    .from('readings')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <TopNav />
      <ReadingsClient readings={readings ?? []} userId={session.user.id!} />
    </>
  )
}
