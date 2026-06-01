import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import {prisma} from "./prisma"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // {
    //   id: "channeli",
    //   name: "Channeli",
    //   type: "oauth",
    //   authorization: {
    //     url: process.env.CHANNELI_AUTHORIZATION_URL,
    //     params: { scope: "email profile" },
    //   },
    //   token: process.env.CHANNELI_TOKEN_URL,
    //   userinfo: process.env.CHANNELI_USERINFO_URL,
    //   profile(profile: any) {
    //     return {
    //       id: profile.userId?.toString() || profile.id?.toString(),
    //       name: profile.person?.name || profile.name,
    //       email: profile.contactInformation?.instituteWebmailAddress || profile.email,
    //       image: profile.person?.displayPicture || profile.image,
    //     }
    //   },
    // },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
})