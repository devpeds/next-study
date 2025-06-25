import { HTMLProps } from "react";

type Props = Omit<HTMLProps<HTMLButtonElement>, "type"> & {
  formType: "credentials" | "email";
};

function SubmitButton({ formType, ...props }: Props) {
  return (
    <button
      className={`cursor-pointer mt-5 w-full py-3 px-4 rounded-md font-bold text-xl ${
        formType === "credentials" ? "bg-green-700" : "bg-blue-700"
      }`}
      {...props}
    />
  );
}

export default SubmitButton;
