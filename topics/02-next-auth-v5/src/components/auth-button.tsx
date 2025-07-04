"use client";

import { TextButton } from "@shared/ui";
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
    <TextButton
      className="font-bold text-inherit hover:text-blue-400 focus:text-blue-400"
      disabled={status === "loading"}
      onClick={handleClick}
    >
      {text}
    </TextButton>
  );
}

export default AuthButton;
