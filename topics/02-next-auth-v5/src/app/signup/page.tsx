import { H2, TextField } from "@shared/ui";
import { redirect } from "next/navigation";

import { signUp, SignUpError } from "@/auth";
import SubmitButton from "@/components/submit-button";

const errorMessages: Record<string, string> = {
  default: "Unable to Sign up",
  [SignUpError.types[0]]: "Some of required fields are missing",
  [SignUpError.types[1]]: "given email is already signed up",
};

export default async function SignUp(
  props: PageQueryParams<{ error?: string; callbackUrl?: string }>,
) {
  const { error, callbackUrl } = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <form
        className="flex flex-col items-stretch space-y-5 bg-gray-100 dark:bg-gray-700 p-12 max-w-lg w-full rounded-xl"
        action={async (data) => {
          "use server";
          const query = new URLSearchParams();
          if (callbackUrl) {
            query.append("callbackUrl", callbackUrl);
          }

          try {
            await signUp(
              Object.fromEntries(Array.from(data) as [string, string][]),
            );

            /**
             * There are an issue after redirecting custom sign-in page:
             *
             * - MissingCSRF error is thrown when signing in with server action
             */
            return redirect(`/api/auth/signin?${query}`);
          } catch (error) {
            if (error instanceof SignUpError) {
              query.append("error", error.type);
              return redirect(`/signup?${query}`);
            }

            throw error;
          }
        }}
      >
        <H2 className="text-center">Sign Up</H2>
        <div className="w-full">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 rounded-md">
              {errorMessages[error] ?? errorMessages.default}
            </div>
          )}
        </div>
        <TextField
          id="signup-form-name"
          required
          name="name"
          label="Name"
          placeholder="Name"
        />
        <TextField
          id="signup-form-email"
          required
          name="email"
          label="Email"
          placeholder="Email"
        />
        <TextField
          id="signup-form-password"
          required
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <SubmitButton>Submit</SubmitButton>
      </form>
    </div>
  );
}
