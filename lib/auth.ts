import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/gmail.send',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Pull phone + settings from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { phoneNumber: true, notifyMinutes: true, darkMode: true, accentColor: true },
        })
        ;(session.user as any).phoneNumber = dbUser?.phoneNumber ?? null
        ;(session.user as any).notifyMinutes = dbUser?.notifyMinutes ?? 15
        ;(session.user as any).darkMode = dbUser?.darkMode ?? false
        ;(session.user as any).accentColor = dbUser?.accentColor ?? '#C98B73'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
