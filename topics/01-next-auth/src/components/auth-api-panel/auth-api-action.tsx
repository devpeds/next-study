"use client";

import Link from "next/link";

type Props = { className?: string } & (
  | {
      action: "navigate";
      href: string;
    }
  | {
      action: "fetch";
      url: string;
    }
);

export type AuthApiAction = Props["action"];

function AuthApiAction({ className, ...props }: Props) {
  if (props.action === "navigate") {
    return (
      <Link className={className} href={props.href}>
        [GO]
      </Link>
    );
  }

  return (
    <button className={className} onClick={() => fetch(props.url)}>
      [TRY]
    </button>
  );
}

export default AuthApiAction;
