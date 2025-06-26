import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

const db = (() => {
  const users = new Map<string, AdapterUser>();
  const accounts = new Map<string, AdapterAccount>();
  const sessions = new Map<string, AdapterSession>();
  const verificationTokens = new Map<string, VerificationToken>();

  users.set("0", {
    id: "0",
    email: "peds@sbtkyc.io",
    emailVerified: new Date(),
    password: "1234",
  });

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
    createUser: (user: AdapterUser) => {
      users.set(user.id, user);
      return user;
    },
    getUser: (id: string) => {
      return users.get(id) ?? null;
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

      return users.get(account.userId) ?? null;
    },
    updateUser: (user: Partial<AdapterUser> & Pick<AdapterUser, "id">) => {
      const id = user.id;
      const updated = { ...users.get(id)!, ...user };
      users.set(id, updated);
      return updated;
    },
    deleteUser: (userId: string) => {
      const user = users.get(userId);
      users.delete(userId);
      return user;
    },
    // accounts
    upsertAccount: (account: AdapterAccount) => {
      accounts.set(`${account.provider}_${account.providerAccountId}`, account);
      return account;
    },
    deleteAccount: ({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) => {
      const key = `${provider}_${providerAccountId}`;
      const account = accounts.get(key);
      accounts.delete(key);
      return account;
    },
    // sessions
    createSession: (session: AdapterSession) => {
      sessions.set(session.sessionToken, session);
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
