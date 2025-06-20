import { baseAuthOptions } from "@/auth/options";
import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  // debug: process.env.NODE_ENV === "development",
  ...baseAuthOptions["jwt"],
  pages: {
    // signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
