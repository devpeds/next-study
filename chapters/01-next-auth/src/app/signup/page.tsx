import FormField from "@/components/form-field";
import db from "@/db";
import { getCsrfToken } from "next-auth/react";
import { redirect } from "next/navigation";

enum Errors {
  RequiredFieldMissing = "RequiredFieldMissing",
  UserExists = "UserExists",
}

const errorMessages: Record<string, string> = {
  [Errors.RequiredFieldMissing]: "Some of required fields are missing",
  [Errors.UserExists]: "given email is already registered",
};

export default async function Register(
  props: PageQueryParams<{ error?: string; callbackUrl?: string }>
) {
  const { error, callbackUrl } = await props.searchParams;

  const csrf = await getCsrfToken();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <form
        className="flex flex-col items-center space-y-8 bg-gray-700 p-12 max-w-3xl w-full rounded-xl"
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
            search = (search ?? "") + (search ? "&" : "") + error;
            return redirect(`/register${search}`);
          }

          if (db.getUserByEmail(email)) {
            const error = `error=${Errors.UserExists}`;
            search = (search ?? "") + (search ? "&" : "") + error;
            return redirect(`/register${search}`);
          }

          const newUser = db.createUser({
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
              {errorMessages[error]}
            </div>
          )}
        </div>
        <input hidden readOnly name="csrfToken" value={csrf} />
        <FormField
          id="register-form-name"
          required
          name="name"
          label="Name"
          placeholder="Name"
        />
        <FormField
          id="register-form-email"
          required
          name="email"
          label="Email"
          placeholder="Email"
        />
        <FormField
          id="register-form-password"
          required
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
        <button
          className="cursor-pointer mt-10 w-full bg-green-700 p-4 rounded-md font-bold text-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
