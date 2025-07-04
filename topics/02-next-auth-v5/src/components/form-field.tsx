import { HTMLProps } from "react";

type Props = {
  id: string;
  label: string;
} & Omit<HTMLProps<HTMLInputElement>, "id" | "className">;

function FormField({ label, id, ...props }: Props) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-3 font-bold text-sm cursor-pointer" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="border rounded-md px-4 py-3 text-md"
        autoComplete="on"
        {...props}
      />
    </div>
  );
}

export default FormField;
