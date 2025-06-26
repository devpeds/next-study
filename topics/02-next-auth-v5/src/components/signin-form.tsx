import Link from "next/link";
import FormField from "./form-field";
import { CredentialInput } from "next-auth/providers/credentials";
import SubmitButton from "./submit-button";
import { ProviderId } from "next-auth/providers";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { HTMLProps } from "react";

type Props = {
  className?: string;
  callbackUrl?: string;
};

type EmailSignInFormProps = Props & {
  providerId: string;
};

type CredentialsSignInFormProps = Props & {
  credentials: [string, CredentialInput][];
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
        return redirect(`/signin?error=${error.type}`);
      }
      throw error;
    }
  };
}

export function EmailSignInForm({
  className,
  providerId,
  callbackUrl,
}: EmailSignInFormProps) {
  return (
    <form className={className} action={handleAction(providerId, callbackUrl)}>
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
  credentials,
  callbackUrl,
}: CredentialsSignInFormProps) {
  return (
    <form
      className={className}
      action={handleAction("credentials", callbackUrl)}
    >
      {credentials.map(([name, credential]) => (
        <FormField
          key={name}
          {...(credential as HTMLProps<HTMLInputElement>)}
          id={`credentials-${name}`}
          label={credential.label ?? name}
          name={name}
        />
      ))}
      <SubmitButton formType="credentials">Sign in</SubmitButton>
      <Link
        className="underline text-blue-500"
        href={"/signup?" + (callbackUrl ?? "")}
      >
        no account?
      </Link>
    </form>
  );
}
