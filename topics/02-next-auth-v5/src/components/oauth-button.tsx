"use client";

import { FilledButton } from "@shared/ui";
import Image from "next/image";
import { OAuthProviderButtonStyles } from "next-auth/providers";
import { signIn } from "next-auth/react";

type Props = {
  providerId: string;
  name: string;
  style?: OAuthProviderButtonStyles;
  callbackUrl?: string;
};

function OAuthButton({ providerId, name, style, callbackUrl }: Props) {
  return (
    <FilledButton
      className="w-full bg-gray-400"
      style={{ background: style?.bg, color: style?.text }}
      size="large"
      onClick={() => signIn(providerId, { callbackUrl })}
    >
      <Image
        src={`https://authjs.dev/img/providers/${providerId}.svg`}
        alt=""
        width={24}
        height={24}
        unoptimized
      />
      <span className="flex-1 px-3">Sign in with {name}</span>
    </FilledButton>
  );
}

export default OAuthButton;
