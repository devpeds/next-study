"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { status } = useSession();

  const text = (() => {
    switch (status) {
      case "loading":
        return "...";
      case "authenticated":
        return "Sign Out";
      case "unauthenticated":
        return "Sign In";
    }
  })();

  const handleClick = () => {
    status === "authenticated" ? signOut() : signIn();
  };

  return (
    <button
      className="cursor-pointer min-w-[65px] font-bold hover:text-primary-400 focus:text-primary-400"
      disabled={status === "loading"}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}

export default AuthButton;
