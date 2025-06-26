import FormField from "@/components/form-field";
import SubmitButton from "@/components/submit-button";
import db from "@/db";
import { randomUUID } from "crypto";
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
        className="flex flex-col items-center space-y-5 bg-gray-100 bg:bg-gray-700 p-12 max-w-lg w-full rounded-xl"
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
            id: randomUUID(),
            name,
            email,
            emailVerified: new Date(),
            password,
          });
          redirect("/api/auth/signin" + search);
        }}
      >
        <h1 className="font-bold text-4xl">Sign Up</h1>
        <div className="w-full">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 rounded-md">
              {errorMessages[error] ?? errorMessages.default}
            </div>
          )}
        </div>
        <FormField
          id="signup-form-name"
          required
          name="name"
          label="Name"
          placeholder="Name"
        />
        <FormField
          id="signup-form-email"
          required
          name="email"
          label="Email"
          placeholder="Email"
        />
        <FormField
          id="signup-form-password"
          required
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <SubmitButton formType="credentials">Submit</SubmitButton>
      </form>
    </div>
  );
}
