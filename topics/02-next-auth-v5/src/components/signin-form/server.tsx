import { signIn } from "@/auth";
import { TextButton, TextField } from "@shared/ui";
import { AuthError } from "next-auth";
import { ProviderId } from "next-auth/providers";
import { CredentialInput } from "next-auth/providers/credentials";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HTMLProps } from "react";
import SubmitButton from "../submit-button";

type Props = {
  className?: string;
  redirectTo?: string;
};

type EmailSignInFormProps = Props & {
  providerId: string;
};

type CredentialsSignInFormProps = Props & {
  formFields: [string, CredentialInput][];
};

function handleAction(providerId: ProviderId, redirectTo?: string) {
  return async (formData: FormData) => {
    "use server";
    try {
      if (redirectTo) {
        formData.append("redirectTo", redirectTo);
      }

      await signIn(providerId, formData);
    } catch (error) {
      if (error instanceof AuthError) {
        return redirect(`/api/auth/signin?error=${error.type}`);
      }
      throw error;
    }
  };
}

export function EmailSignInForm({
  className,
  providerId,
  redirectTo,
}: EmailSignInFormProps) {
  return (
    <form className={className} action={handleAction(providerId, redirectTo)}>
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
  formFields,
  redirectTo,
}: CredentialsSignInFormProps) {
  return (
    <form
      className={className}
      action={handleAction("credentials", redirectTo)}
    >
      {formFields.map(([name, field]) => (
        <TextField
          key={name}
          className="w-full"
          {...(field as HTMLProps<HTMLInputElement>)}
          id={`credentials-${name}`}
          label={field.label ?? name}
          name={name}
        />
      ))}
      <SubmitButton className="w-full">Sign in</SubmitButton>
      <TextButton
        className="underline text-blue-400"
        size="small"
        as={Link}
        href={"/signup?" + (redirectTo ?? "")}
      >
        no account?
      </TextButton>
    </form>
  );
}
