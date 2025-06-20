import { AuthOptions } from "next-auth";
import CustomAdapter from "../adapter";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const adapter = CustomAdapter();

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
  session: {
    strategy: "jwt",
  },
};

export const databaseAuthOptions: AuthOptions = {
  ...sharedAuthOptions,
  session: {
    strategy: "database", // default options when adapter is given
  },
  // TODO: create session when user sign in with credentials
};
