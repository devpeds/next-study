import { AuthOptions } from "next-auth";
import simpleAuthOptions from "./simple";
import { databaseAuthOptions, jwtAuthOptions } from "./with-adapter";

const baseAuthOptions = {
  simple: simpleAuthOptions,
  jwt: jwtAuthOptions,
  database: databaseAuthOptions,
};

const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === "development",
  ...baseAuthOptions["database"],
  pages: {
    signIn: "/signin",
  },
};

export default authOptions;
