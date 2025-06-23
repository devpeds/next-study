import FormField from "@/components/form-field";
import db from "@/db";
import { getCsrfToken } from "next-auth/react";
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

  const csrf = await getCsrfToken();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <form
        className="flex flex-col items-center space-y-5 bg-gray-700 p-12 max-w-lg w-full rounded-xl"
        action={async (data) => {
          "use server";
          if (csrf !== data.get("csrfToken")) {
            throw new Error("unmatched CSRF token");
          }

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
        <h1 className="font-bold text-4xl">Sign Up</h1>
        <div className="w-full">
          {error && (
            <div className="bg-red-200 text-red-800 p-4 rounded-md">
              {errorMessages[error] ?? errorMessages.default}
            </div>
          )}
        </div>
        <input hidden readOnly name="csrfToken" value={csrf} />
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
        <button
          className="cursor-pointer mt-5 w-full bg-green-700 px-4 py-3 rounded-md font-bold text-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
