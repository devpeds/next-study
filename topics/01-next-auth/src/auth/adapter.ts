import db from "@/db";
import { Adapter } from "next-auth/adapters";

const CustomAdapter = (): Adapter => ({
  // required methods for all sign-in flows
  createUser: db.createUser,
  updateUser: db.updateUser,
  getUser: db.getUser,
  getUserByEmail: db.getUserByEmail,
  getUserByAccount: db.getUserByAccount,
  linkAccount: db.upsertAccount,
  createSession: db.createSession,
  updateSession: db.updateSession,
  deleteSession: db.deleteSession,
  getSessionAndUser: (token) => {
    const session = db.getSession(token);
    if (!session) {
      return null;
    }

    const user = db.getUser(session.userId);
    if (!user) {
      return null;
    }
    return { session, user };
  },
  // required methods for email sign-in
  createVerificationToken: db.createVerificationToken,
  useVerificationToken: db.getVerificationToken,
});

export default CustomAdapter;
