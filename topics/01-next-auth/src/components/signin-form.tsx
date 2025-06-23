"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import FormField from "./form-field";
import { CredentialInput } from "next-auth/providers/credentials";

type Props = {
  className?: string;
  csrfToken: string;
  credentials: [string, CredentialInput][];
  callbackUrl?: string;
};

function SignInForm({ className, csrfToken, credentials, callbackUrl }: Props) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        signIn("credentials", {
          ...Object.fromEntries(formData.entries()),
          callbackUrl,
        });
      }}
    >
      <input hidden name="csrfToken" defaultValue={csrfToken} />
      {credentials.map(([name, credential]) => (
        <FormField
          key={name}
          id={`credentials-${name}`}
          required
          label={credential.label ?? name}
          name={name}
          type={credential.type}
          placeholder={credential.placeholder}
        />
      ))}
      <button
        className="cursor-pointer mt-5 w-full bg-green-700 py-3 px-4 rounded-md font-bold text-xl"
        type="submit"
      >
        Sign in
      </button>
      <Link
        className="underline text-blue-300"
        href={"/signup?" + (callbackUrl ?? "")}
      >
        no account?
      </Link>
    </form>
  );
}

export default SignInForm;
