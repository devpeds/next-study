import { Adapter } from "next-auth/adapters";

type SignUpErrorType = (typeof SignUpError.types)[number];

export class SignUpError extends Error {
  static types = ["RequiredFieldMissing", "UserExists"] as const;

  type: SignUpErrorType;

  constructor(type: SignUpErrorType) {
    super(`Sign Up Error: ${type}`);
    this.type = type;
  }
}

export default function createSignUp(adapter: Adapter) {
  return async ({ name, email, password }: Record<string, string>) => {
    if (!name || !email || !password) {
      throw new SignUpError("RequiredFieldMissing");
    }

    if (await adapter.getUserByEmail?.(email as string)) {
      throw new SignUpError("UserExists");
    }

    await adapter.createUser?.({
      name,
      email,
      emailVerified: new Date(),
      password,
    });
  };
}
