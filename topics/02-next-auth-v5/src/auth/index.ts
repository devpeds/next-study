import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { randomUUID } from "crypto";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Nodemailer from "next-auth/providers/nodemailer";
import PassKey from "next-auth/providers/passkey";
import { cookies } from "next/headers";
import createSignUp from "./signup";

const COOKIE_SESSION_TOKEN = "authjs.session-token";

const adapter = PrismaAdapter(prisma);

const session: Required<NextAuthConfig["session"]> = {
  strategy: "database",
  maxAge: 2592000,
  updateAge: 86400,
  generateSessionToken: randomUUID,
};

export const providers: NextAuthConfig["providers"] = [
  GitHub,
  PassKey({
    formFields: {
      email: {
        label: "Email",
        required: true,
        autocomplete: "username webauthn",
        placeholder: "example@example.com",
      },
    },
  }),
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
  experimental: {
    enableWebAuthn: true,
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
        console.log("jwt.encode");
        return (await cookies()).get(COOKIE_SESSION_TOKEN)?.value ?? "";
      },
    },
  }),
});

export const signUp = createSignUp(adapter);

export { SignUpError } from "./signup";
