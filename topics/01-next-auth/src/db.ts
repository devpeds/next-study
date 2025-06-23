import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

const db = (() => {
  let userId = 0;

  const users = new Map<number, AdapterUser>();
  const accounts = new Map<string, AdapterAccount>();
  const sessions = new Map<string, AdapterSession>();
  const verificationTokens = new Map<string, VerificationToken>();

  return {
    all: () => {
      return {
        users,
        accounts,
        sessions,
        verificationTokens,
      };
    },
    // users
    createUser: (user: Omit<AdapterUser, "id">) => {
      const newUser = { id: `${userId}`, ...user };
      users.set(userId++, newUser);
      return newUser;
    },
    getUser: (id: string) => {
      return users.get(parseInt(id)) ?? null;
    },
    getUserByEmail: (email: string) => {
      const user = Array.from(users).find(([, user]) => user.email === email);
      return user?.[1] ?? null;
    },
    getUserByAccount: ({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
      const account = accounts.get(`${provider}_${providerAccountId}`);
      if (!account) {
        return null;
      }

      return users.get(parseInt(account.userId)) ?? null;
    },
    updateUser: (user: Partial<AdapterUser> & Pick<AdapterUser, "id">) => {
      const id = parseInt(user.id);
      const updated = { ...users.get(id)!, ...user };
      users.set(id, updated);
      return updated;
    },
    // accounts
    upsertAccount: (account: AdapterAccount) => {
      console.log("account created", account);
      accounts.set(`${account.provider}_${account.providerAccountId}`, account);
    },
    // sessions
    createSession: (session: AdapterSession) => {
      sessions.set(session.sessionToken, session);
      console.log("session created", session.sessionToken);
      return session;
    },
    getSession: (token: string) => {
      return sessions.get(token) ?? null;
    },
    updateSession: (
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) => {
      const updated = { ...sessions.get(session.sessionToken)!, ...session };
      sessions.set(session.sessionToken, updated);
      return updated;
    },
    deleteSession: (token: string) => {
      const session = sessions.get(token)!;
      sessions.delete(token);
      console.log("session deleted", token);
      return session;
    },
    // verification tokens
    createVerificationToken: (token: VerificationToken) => {
      const key = `${token.identifier}_${token.token}`;
      verificationTokens.set(key, token);
      return token;
    },
    getVerificationToken: ({
      identifier,
      token,
    }: Pick<VerificationToken, "identifier" | "token">) => {
      return verificationTokens.get(`${identifier}_${token}`) ?? null;
    },
  };
})();

export default db;
