import simpleAuthOptions from "./simple";
import { databaseAuthOptions, jwtAuthOptions } from "./with-adapter";

export const baseAuthOptions = {
  simple: simpleAuthOptions,
  jwt: jwtAuthOptions,
  database: databaseAuthOptions,
};
