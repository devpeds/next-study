import { randomUUID } from "crypto";
import {
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

const inMemoryDB = (() => {
  const users = new Map<string, AdapterUser>();
  const accounts = new Map<string, AdapterAccount>();
  const sessions = new Map<string, AdapterSession>();
  const verificationTokens = new Map<string, VerificationToken>();
  const authenticators = new Map<string, AdapterAuthenticator>();

  return {
    all: () => {
      const entries = Object.entries({
        users,
        accounts,
        sessions,
        verificationTokens,
        authenticators,
      }).map(([key, obj]) => [
        key,
        Array.from((obj as Map<string, unknown>).values()),
      ]);
      return Object.fromEntries(entries);
    },
    // users
    createUser: (user: Omit<AdapterUser, "id"> & { id?: string | null }) => {
      // user id is empty when user created via passkey authentication
      const userId = user.id || randomUUID();
      const created = { ...user, id: userId };
      users.set(userId, created);
      return created;
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
    getAccount: (providerAccountId: string, provider: string) => {
      return accounts.get(`${provider}_${providerAccountId}`) ?? null;
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
    // authenticator
    createAuthenticator: (authenticator: AdapterAuthenticator) => {
      authenticators.set(authenticator.credentialID, authenticator);
      return authenticator;
    },
    getAuthenticator: (credentialId: string) => {
      return authenticators.get(credentialId) ?? null;
    },
    getAuthenticatorsByUserId: (userId: string) => {
      return Array.from(authenticators)
        .filter(([, authenticator]) => authenticator.userId === userId)
        .map(([_, authenticator]) => authenticator);
    },
    updateAuthenticator: (
      authenticator: Partial<AdapterAuthenticator> & {
        credentialID: AdapterAuthenticator["credentialID"];
      }
    ) => {
      const updated = {
        ...authenticators.get(authenticator.credentialID)!,
        ...authenticator,
      };
      authenticators.set(authenticator.credentialID, updated);

      return updated;
    },
  };
})();

export default inMemoryDB;
