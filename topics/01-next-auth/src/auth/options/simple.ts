import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

const simpleAuthOptions: AuthOptions = {
  providers: [
    // OAuth Providers
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Email Provider: adapter must be given
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

        // custom logic (ex: call backend`s signIn API)
        throw new Error("unimplemented");
      },
    }),
  ],
};

export default simpleAuthOptions;
