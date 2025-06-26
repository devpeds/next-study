import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Nodemailer from "next-auth/providers/nodemailer";
import CustomAdapter from "./adapter";
import Credentials from "next-auth/providers/credentials";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const COOKIE_SESSION_TOKEN = "authjs.session-token";

const adapter = CustomAdapter();

const session: Required<NextAuthConfig["session"]> = {
  strategy: "database",
  maxAge: 2592000,
  updateAge: 86400,
  generateSessionToken: randomUUID,
};

export const providers: NextAuthConfig["providers"] = [
  GitHub,
  Nodemailer({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
  }),
  Credentials({
    credentials: {
      email: {
        type: "text",
        placeholder: "example@example.com",
        required: true,
      },
      password: { type: "password", placeholder: "password", required: true },
    },
    authorize: async ({ email, password }) => {
      if (!email || !password) {
        return null;
      }

      const user = await adapter.getUserByEmail?.(email as string);
      if (!user) {
        return null;
      }

      return user.password === password ? user : null;
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  adapter,
  session,
  providers,
  pages: {
    signIn: "/signin",
  },
  ...(session.strategy === "database" && {
    callbacks: {
      jwt: async ({ token, user, account }) => {
        if (account?.type === "credentials") {
          const sessionToken = session.generateSessionToken();
          const userId = user.id!;
          const expires = new Date(Date.now() + session.maxAge * 1000);

          await adapter.createSession?.({ sessionToken, userId, expires });
          (await cookies()).set(COOKIE_SESSION_TOKEN, sessionToken, {
            expires,
          });
        }

        return token;
      },
    },
    jwt: {
      encode: async () => {
        return (await cookies()).get(COOKIE_SESSION_TOKEN)?.value ?? "";
      },
    },
  }),
});
