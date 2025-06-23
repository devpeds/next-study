"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import FormField from "./form-field";
import { CredentialInput } from "next-auth/providers/credentials";
import SubmitButton from "./submit-button";
import { FormEvent } from "react";
import { RedirectableProviderType } from "next-auth/providers/index";

type Props = {
  className?: string;
  csrfToken: string;
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

export function EmailSignInForm({ className, csrfToken, callbackUrl }: Props) {
  return (
    <form className={className} onSubmit={handleSubmit("email", callbackUrl)}>
      <input name="csrfToken" type="hidden" readOnly value={csrfToken} />
      <FormField
        id="email-id-email"
        name="email"
        label="Email"
        placeholder="example@example.com"
      />
      <SubmitButton formType="email">Sign in with Email</SubmitButton>
    </form>
  );
}

export function CredentialsSignInForm({
  className,
  csrfToken,
  credentials,
  callbackUrl,
}: CredentialsSignInFormProps) {
  return (
    <form
      className={className}
      onSubmit={handleSubmit("credentials", callbackUrl)}
    >
      <input name="csrfToken" type="hidden" readOnly value={csrfToken} />
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
      <SubmitButton formType="credentials">Sign in</SubmitButton>
      <Link
        className="underline text-blue-300"
        href={"/signup?" + (callbackUrl ?? "")}
      >
        no account?
      </Link>
    </form>
  );
}
