import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { AuthOptions, SessionOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Github from "next-auth/providers/github";

import CustomAdapter from "../adapter";

const COOKIE_SESSION_TOKEN = "next-auth.session-token";

const adapter = CustomAdapter();

const sessionOptions: Omit<SessionOptions, "strategy"> = {
  maxAge: 2592000, // 30 days in seconds
  updateAge: 86400, // 1 day in seconds
  generateSessionToken: () => randomUUID(),
};

const sharedAuthOptions: AuthOptions = {
  adapter,
  providers: [
    // OAuth Providers
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Email Provider
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Credentials Provider
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async function (credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await adapter.getUserByEmail?.(credentials.email);
        if (!user) {
          return null;
        }

        return user.password === credentials.password ? user : null;
      },
    }),
  ],
};

export const jwtAuthOptions: AuthOptions = {
  ...sharedAuthOptions,
  session: { strategy: "jwt", ...sessionOptions },
};

export const databaseAuthOptions: AuthOptions = {
  ...sharedAuthOptions,
  session: {
    strategy: "database", // default options when adapter is given
    ...sessionOptions,
  },
  // NOTE: For credentials sign-in
  // https://github.com/devpeds/next-study/blob/main/topics/01-next-auth/docs/credentials-with-db.md
  callbacks: {
    jwt: async ({ token, user: { id: userId }, account }) => {
      // If credentials sign in, create session token
      if (account?.type === "credentials") {
        const sessionToken = await sessionOptions.generateSessionToken();
        const expires = new Date(Date.now() + sessionOptions.maxAge * 1000);

        await adapter.createSession?.({ sessionToken, userId, expires });
        (await cookies()).set(COOKIE_SESSION_TOKEN, sessionToken, {
          expires,
        });
      }
      return token;
    },
  },
  jwt: {
    // Show cookie value created in `callbacks.signIn()` instead of default behavior
    encode: async () => {
      return (await cookies()).get(COOKIE_SESSION_TOKEN)?.value ?? "";
    },
  },
};
