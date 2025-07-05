import SubmitButton from "@/components/submit-button";
import db from "@/db";
import { H2, TextField } from "@shared/ui";
import { redirect, RedirectType } from "next/navigation";

enum Errors {
  RequiredFieldMissing = "RequiredFieldMissing",
  UserExists = "UserExists",
}

const errorMessages: Record<string, string> = {
  default: "Unable to Sign up",
  [Errors.RequiredFieldMissing]: "Some of required fields are missing",
  [Errors.UserExists]: "given email is already signed up",
};

export default async function SignUp(
  props: PageQueryParams<{ error?: string; callbackUrl?: string }>
) {
  const { error, callbackUrl } = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <form
        className="flex flex-col items-center space-y-5 bg-gray-700 p-12 max-w-lg w-full rounded-xl"
        action={async (data) => {
          "use server";
          let search = (callbackUrl && `?callbackUrl=${callbackUrl}`) ?? "";

          const name = data.get("name") as string | null;
          const email = data.get("email") as string | null;
          const password = data.get("password") as string | null;

          if (!name || !email || !password) {
            const error = `error=${Errors.RequiredFieldMissing}`;
            search = (search ?? "") + (search ? "&" : "?") + error;
            return redirect(`/signup${search}`, RedirectType.replace);
          }

          if (db.getUserByEmail(email)) {
            const error = `error=${Errors.UserExists}`;
            search = (search ?? "") + (search ? "&" : "?") + error;
            return redirect(`/signup${search}`, RedirectType.replace);
          }

          db.createUser({
            name,
            email,
            emailVerified: new Date(),
            password,
          });
          redirect("/api/auth/signin" + search);
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
          className="w-full"
          required
          name="name"
          label="Name"
          placeholder="Name"
        />
        <TextField
          id="signup-form-email"
          className="w-full"
          required
          name="email"
          label="Email"
          placeholder="Email"
        />
        <TextField
          id="signup-form-password"
          className="w-full"
          required
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <SubmitButton className="w-full">Submit</SubmitButton>
      </form>
    </div>
  );
}
