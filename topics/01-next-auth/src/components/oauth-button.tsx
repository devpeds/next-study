"use client";

import Image from "next/image";
import { OAuthProviderButtonStyles } from "next-auth/providers/oauth";
import { signIn } from "next-auth/react";

type Props = {
  providerId: string;
  name: string;
  style?: OAuthProviderButtonStyles;
  callbackUrl?: string;
};

function OAuthButton({ providerId, name, style, callbackUrl }: Props) {
  return (
    <button
      className="cursor-pointer w-full bg-gray-400 text-gray-800 rounded-md py-3 px-4 font-bold text-xl flex items-center justify-center"
      style={{ background: style?.bg, color: style?.text }}
      onClick={() => signIn(providerId, { callbackUrl })}
    >
      <Image
        src={`https://authjs.dev/img/providers/${providerId}.svg`}
        alt=""
        width={24}
        height={24}
      />
      <span className="flex-1 px-3">Sign in with {name}</span>
    </button>
  );
}

export default OAuthButton;
