import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

import inMemoryDB from "@/db/in-memory";
import { prisma as prismaClient } from "@/db/prisma";

const InMemoryAdapter = (): Adapter => ({
  // required methods for all sign-in flows
  createUser: inMemoryDB.createUser,
  getUser: inMemoryDB.getUser,
  getUserByEmail: inMemoryDB.getUserByEmail,
  getUserByAccount: inMemoryDB.getUserByAccount,
  updateUser: inMemoryDB.updateUser,
  linkAccount: inMemoryDB.upsertAccount,
  unlinkAccount: inMemoryDB.deleteAccount,
  createSession: inMemoryDB.createSession,
  updateSession: inMemoryDB.updateSession,
  deleteSession: inMemoryDB.deleteSession,
  getSessionAndUser: (token) => {
    const session = inMemoryDB.getSession(token);
    if (!session) {
      return null;
    }

    const user = inMemoryDB.getUser(session.userId);
    if (!user) {
      return null;
    }
    return { session, user };
  },
  // required methods for email sign-in
  createVerificationToken: inMemoryDB.createVerificationToken,
  useVerificationToken: inMemoryDB.getVerificationToken,
  // for WebAuthn
  getAccount: inMemoryDB.getAccount,
  createAuthenticator: inMemoryDB.createAuthenticator,
  getAuthenticator: inMemoryDB.getAuthenticator,
  updateAuthenticatorCounter: (credentialID, counter) => {
    return inMemoryDB.updateAuthenticator({ credentialID, counter });
  },
  listAuthenticatorsByUserId: inMemoryDB.getAuthenticatorsByUserId,
});

function createAdapter(dbType: typeof process.env.ADAPTER_TYPE = "prisma") {
  switch (dbType) {
    case "in-memory":
      return InMemoryAdapter();
    case "prisma":
      return PrismaAdapter(prismaClient);
  }
}

export default createAdapter;
