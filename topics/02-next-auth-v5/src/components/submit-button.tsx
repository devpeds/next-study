import { HTMLProps } from "react";

type Props = Omit<HTMLProps<HTMLButtonElement>, "type">;

function SubmitButton(props: Props) {
  return (
    <button
      className="cursor-pointer mt-5 w-full py-3 px-4 rounded-md font-bold text-xl text-white bg-green-700"
      {...props}
    />
  );
}

export default SubmitButton;
