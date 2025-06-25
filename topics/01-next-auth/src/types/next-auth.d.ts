import { AdapterUser as OriginalAdapterUser } from "next-auth/adapters";

declare module "next-auth/adapters" {
  export interface AdapterUser extends OriginalAdapterUser {
    password?: string;
  }
}
