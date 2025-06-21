import authOptions from "@/auth/options";
import OAuthButton from "@/components/oauth-button";
import SignInForm from "@/components/signin-form";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

type ProviderType = (typeof authOptions)["providers"][number]["type"];

const providerTypes: ProviderType[] = ["oauth", "credentials"];

const errorMessages: Record<string, string> = {
  default: "Unable to sign in.",
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallbackError: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
};

export default async function SignIn({
  searchParams,
}: PageQueryParams<{ callbackUrl?: string; error?: string }>) {
  const [{ callbackUrl, error }, csrfToken] = await Promise.all([
    await searchParams,
    getCsrfToken(),
  ]);

  const providers = authOptions.providers.sort((lhs, rhs) => {
    return providerTypes.indexOf(lhs.type) - providerTypes.indexOf(rhs.type);
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center space-y-8 bg-gray-700 p-12 max-w-lg w-full rounded-xl">
        <h1 className="font-bold text-4xl">Sign In</h1>
        <div className="w-full">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 rounded-md">
              {errorMessages[error] ?? errorMessages.default}
            </div>
          )}
        </div>
        {providers.map((provider, index) => {
          return (
            <Fragment key={provider.id}>
              {provider.type === "oauth" && (
                <OAuthButton
                  providerId={provider.id}
                  name={provider.name}
                  style={provider.style}
                  callbackUrl={callbackUrl}
                />
              )}
              {provider.type === "credentials" && (
                <SignInForm
                  className="flex flex-col items-center w-full space-y-5"
                  csrfToken={csrfToken ?? ""}
                  credentials={Object.entries(provider.credentials)}
                  callbackUrl={callbackUrl}
                />
              )}
              {!index && <span className="text-sm">OR</span>}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
