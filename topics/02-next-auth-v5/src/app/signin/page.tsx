import { providers } from "@/auth";
import OAuthButton from "@/components/oauth-button";
import {
  CredentialsSignInForm,
  EmailSignInForm,
} from "@/components/signin-form";
import { Fragment } from "react";

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
  const { callbackUrl, error } = await searchParams;
  if (error) {
    console.log(error);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <div className="flex flex-col items-center space-y-8 bg-gray-100 dark:bg-gray-700 p-12 max-w-lg w-full rounded-xl">
        <h1 className="font-bold text-4xl">Sign In</h1>
        <div className="w-full">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 rounded-md">
              {errorMessages[error] ?? errorMessages.default}
            </div>
          )}
        </div>
        {providers.map((provider, index) => {
          const providerData =
            typeof provider === "function" ? provider() : provider;
          return (
            <Fragment key={providerData.id}>
              {((provider) => {
                switch (provider.type) {
                  case "oauth":
                  case "oidc":
                    return (
                      <OAuthButton
                        providerId={providerData.id}
                        name={provider.name}
                        style={provider.style}
                        callbackUrl={callbackUrl}
                      />
                    );
                  case "email":
                    return (
                      <EmailSignInForm
                        className="flex flex-col items-center w-full space-y-5"
                        providerId={provider.id}
                        callbackUrl={callbackUrl}
                      />
                    );
                  case "credentials":
                    return (
                      <CredentialsSignInForm
                        className="flex flex-col items-center w-full space-y-5"
                        credentials={Object.entries(provider.credentials)}
                        callbackUrl={callbackUrl}
                      />
                    );
                  default:
                    console.warn("unknown provider:", provider.type);
                    return <></>;
                }
              })(providerData)}
              {!index && <span className="text-sm">OR</span>}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
