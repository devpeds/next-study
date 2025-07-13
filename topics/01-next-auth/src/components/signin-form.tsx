"use client";

import { TextField } from "@shared/ui";
import { Link } from "@shared/ui/next";
import { CredentialInput } from "next-auth/providers/credentials";
import { RedirectableProviderType } from "next-auth/providers/index";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

import SubmitButton from "./submit-button";

type Props = {
  className?: string;
  callbackUrl?: string;
};

type CredentialsSignInFormProps = Props & {
  credentials: [string, CredentialInput][];
};

function handleSubmit(
  providerType: RedirectableProviderType,
  callbackUrl?: string,
) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    signIn(providerType, {
      ...Object.fromEntries(formData.entries()),
      callbackUrl,
    });
  };
}

export function EmailSignInForm({ className, callbackUrl }: Props) {
  return (
    <form className={className} onSubmit={handleSubmit("email", callbackUrl)}>
      <TextField
        id="email-id-email"
        className="w-full"
        name="email"
        label="Email"
        placeholder="example@example.com"
      />
      <SubmitButton className="w-full">Sign in with Email</SubmitButton>
    </form>
  );
}

export function CredentialsSignInForm({
  className,
  credentials,
  callbackUrl,
}: CredentialsSignInFormProps) {
  return (
    <form
      className={className}
      onSubmit={handleSubmit("credentials", callbackUrl)}
    >
      {credentials.map(([name, credential]) => (
        <TextField
          key={name}
          id={`credentials-${name}`}
          className="w-full"
          required
          label={credential.label ?? name}
          name={name}
          type={credential.type}
          placeholder={credential.placeholder}
        />
      ))}
      <SubmitButton className="w-full">Sign in</SubmitButton>
      <Link href={"/signup?" + (callbackUrl ?? "")}>no account?</Link>
    </form>
  );
}
