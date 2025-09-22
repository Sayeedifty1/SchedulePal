import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

import NextAuth from "next-auth";
import { getGoogleAccountByEmail } from "@/features/auth/user-auth-session-model.server";
import {
  isAssessTokenExpired,
  refreshAndUpdateAccessToken,
  setSessionAccessToken,
} from "@/features/auth/authentication-helper.server";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send",

          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = account.expires_at;

        // save these tokens in the database (to keep them persistent)
        await prisma.account.updateMany({
          where: { providerAccountId: account.providerAccountId },
          data: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
          },
        });
      }
      return token;
    },
    async session({ session }) {
      const account = await getGoogleAccountByEmail(session.user.email ?? "");
      if (!account) return session;

      // check if the token is expired
      const accessToken = isAssessTokenExpired(account.expires_at)
        ? await refreshAndUpdateAccessToken(account) //refresh if expired
        : account.access_token; // else use the existing one

      //inject fresh access token in the session
      return setSessionAccessToken(session, accessToken);
    },
  },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/auth",
  },

  debug: process.env.NODE_ENV === "development",
});
