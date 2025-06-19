import NextAuth, {
  AuthOptions,
  Awaitable,
  RequestInternal,
  User,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import Github from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  // debug: process.env.NODE_ENV === "development",
  debug: false,
  providers: [
    // OAuth Providers
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // TODO: Email Provider (Email Adapter is required)
    // Email({}),
    // Credentials Provider
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: function (
        credentials: Record<string, string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Awaitable<User | null> {
        console.log(
          `authorize.credentials: ${JSON.stringify(credentials, null, 2)}`
        );
        return null;
      },
    }),
  ],
  callbacks: {
    signIn: async (params) => {
      const data = {
        userId: params.account?.userId,
        type: params.account?.type,
        provider: params.account?.provider,
        scope: params.account?.scope,
        sessionState: params.account?.session_state,
        ...(params.account?.type === "email" && params.email),
      };
      console.log(`callbacks.signIn: ${JSON.stringify(data, null, 2)}`);
      return true;
    },
    redirect: async (params) => {
      console.log(`callbacks.redirect: ${JSON.stringify(params, null, 2)}`);
      return params.url;
    },
    jwt: async (params) => {
      const data = { trigger: params.trigger };
      console.log(`callbacks.jwt: ${JSON.stringify(data, null, 2)}`);
      return params.token;
    },
    session: async (params) => {
      const data = {
        expireAt: params.session?.expires,
        trigger: params.trigger,
      };
      console.log(`callbacks.session: ${JSON.stringify(data, null, 2)}`);
      return params.session;
    },
  },
  events: {
    signIn: async (message) => {
      console.log(`events.signIn: isNewUser = ${message.isNewUser}`);
    },
    signOut: async ({ session }) => {
      console.log(`events.signOut: ${JSON.stringify(session, null, 2)}`);
    },
    createUser: async ({ user }) => {
      console.log(`events.createUser: ${JSON.stringify(user, null, 2)}`);
    },
    updateUser: async ({ user }) => {
      console.log(`events.updateUser: ${JSON.stringify(user, null, 2)}`);
    },
    linkAccount: async ({ account }) => {
      const message = {
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        scope: account.scope,
        sessionState: account.session_state,
      };
      console.log(`events.linkAccount: ${JSON.stringify(message, null, 2)}`);
    },
    session: async ({ session }) => {
      console.log(`events.session: ${JSON.stringify(session, null, 2)}`);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
