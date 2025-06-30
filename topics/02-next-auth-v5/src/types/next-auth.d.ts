import {
  AdapterUser as OriginalAdapterUser,
  Adapter as OriginalAdapter,
} from "next-auth/adapters";

declare module "next-auth/adapters" {
  interface AdapterUser extends OriginalAdapterUser {
    password?: string;
  }

  interface Adapter extends OriginalAdapter {
    createUser?(
      user: Omit<AdapterUser, "id"> & { id?: string }
    ): Awaitable<AdapterUser>;
  }
}
