import { AuthOptions, SessionOptions } from "next-auth";
import CustomAdapter from "../adapter";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

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
    // Credentials Provider
    Credentials({
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
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
  // https://nneko.branche.online/next-auth-credentials-provider-with-the-database-session-strategy
  callbacks: {
    signIn: async ({ user: { id: userId }, credentials }) => {
      // If credentials sign in, create session token
      if (credentials) {
        const sessionToken = await sessionOptions.generateSessionToken();
        const expires = new Date(Date.now() + sessionOptions.maxAge * 1000);

        await adapter.createSession?.({ sessionToken, userId, expires });
        (await cookies()).set(COOKIE_SESSION_TOKEN, sessionToken, {
          expires,
        });
      }

      return true;
    },
  },
  jwt: {
    // Show cookie value created in `callbacks.signIn()` instead of default behavior
    encode: async () => {
      return (await cookies()).get(COOKIE_SESSION_TOKEN)?.value ?? "";
    },
  },
};
