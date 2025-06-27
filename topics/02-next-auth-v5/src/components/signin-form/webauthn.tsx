"use client";

import { CredentialInput } from "next-auth/providers";
import { signIn } from "next-auth/webauthn";
import FormField from "../form-field";
import { FormEvent, HTMLProps } from "react";
import SubmitButton from "../submit-button";

type Props = {
  className?: string;
  providerId: string;
  providerName: String;
  formFields: [string, CredentialInput][];
  redirectTo?: string;
};

function WebAuthnSignInForm({
  className,
  providerId,
  providerName,
  formFields,
  redirectTo,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    signIn(providerId, {
      ...Object.fromEntries(formData),
      redirectTo,
    });
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {formFields.map(([name, { autocomplete, ...field }]) => (
        <FormField
          key={name}
          {...(field as HTMLProps<HTMLInputElement>)}
          // 프로바이더(Passkey) 설정에서 `autocomplete: "username webauthn"`으로 데이터가 들어옴
          // 설정 단에서 autocomplete 대신 autoComplete을 사용하면 Configuration Error가 발생해
          // 컴포넌트 단에서 autocomplete를 autoComplete로 변경
          autoComplete={autocomplete as string}
          id={`credentials-${name}`}
          label={field.label ?? name}
          name={name}
        />
      ))}
      <SubmitButton>Sign In with {providerName}</SubmitButton>
    </form>
  );
}

export default WebAuthnSignInForm;
