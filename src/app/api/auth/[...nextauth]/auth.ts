import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import LinkedInProvider from "next-auth/providers/linkedin"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Adapter } from "next-auth/adapters"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"

const prisma = new PrismaClient()

export const config = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      authorization: { params: { scope: 'profile email openid' } },
      issuer: 'https://www.linkedin.com/oauth',
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      async profile(profile) {
        const user = await prisma.user.findUnique({
          where: { email: profile.email }
        })
        if (user && profile.picture && user.image !== profile.picture) {
          await prisma.user.update({
            where: { email: profile.email },
            data: { image: profile.picture }
          })
        }
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Add this line
  jwt: {
    secret: process.env.JWT_SECRET,
  },
} as NextAuthOptions

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  console.log('🔐 Starting auth check')
  return getServerSession(...args, config)
}
