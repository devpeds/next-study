"use client";

import { ActionButton } from "@shared/ui";
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
    <ActionButton disabled={status === "loading"} onClick={handleClick}>
      {text}
    </ActionButton>
  );
}

export default AuthButton;
