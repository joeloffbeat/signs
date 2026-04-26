import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

declare module 'next-auth' {
  interface Session {
    user: { id?: string; name?: string | null; email?: string | null; image?: string | null }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        mode: { label: 'Mode', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, name, mode } = credentials as {
          email: string; password: string; name: string; mode: string
        }
        if (!email || !password) return null

        const { data: existing } = await supabaseAdmin
          .from('users').select('*').eq('email', email).single()

        if (mode === 'signup') {
          if (existing) throw new Error('Email already registered')
          const hash = await bcrypt.hash(password, 10)
          const { data: newUser } = await supabaseAdmin
            .from('users').insert({ email, name: name || email, password_hash: hash }).select().single()
          return newUser ? { id: newUser.id, email: newUser.email, name: newUser.name } : null
        }

        if (!existing) throw new Error('No account found')
        const valid = await bcrypt.compare(password, existing.password_hash)
        if (!valid) throw new Error('Incorrect password')
        return { id: existing.id, email: existing.email, name: existing.name, image: existing.avatar_url }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const { data: existing } = await supabaseAdmin
          .from('users').select('id').eq('email', user.email!).single()
        if (!existing) {
          await supabaseAdmin.from('users').insert({
            email: user.email!, name: user.name, avatar_url: user.image,
          })
        }
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})
