"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import FormField from "./form-field";
import { CredentialInput } from "next-auth/providers/credentials";
import SubmitButton from "./submit-button";
import { FormEvent } from "react";
import { RedirectableProviderType } from "next-auth/providers/index";
import { TextButton } from "@shared/ui";

type Props = {
  className?: string;
  callbackUrl?: string;
};

type CredentialsSignInFormProps = Props & {
  credentials: [string, CredentialInput][];
};

function handleSubmit(
  providerType: RedirectableProviderType,
  callbackUrl?: string
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
      <FormField
        id="email-id-email"
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
      <SubmitButton className="w-full">Sign in</SubmitButton>
      <TextButton
        className="underline text-blue-400"
        size="small"
        as={Link}
        href={"/signup?" + (callbackUrl ?? "")}
      >
        no account?
      </TextButton>
    </form>
  );
}
