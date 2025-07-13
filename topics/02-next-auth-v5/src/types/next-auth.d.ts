import {
  Adapter as OriginalAdapter,
  AdapterUser as OriginalAdapterUser,
} from "next-auth/adapters";

declare module "next-auth/adapters" {
  interface AdapterUser extends OriginalAdapterUser {
    password?: string;
  }

  interface Adapter extends OriginalAdapter {
    createUser?(
      user: Omit<AdapterUser, "id"> & { id?: string },
    ): Awaitable<AdapterUser>;
  }
}
