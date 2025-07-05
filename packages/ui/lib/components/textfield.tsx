import { cn } from "@lib/utils";

type TextFieldProps = {
  label: string;
} & React.HTMLProps<HTMLInputElement>;

export function TextField({ label, id, className, ...props }: TextFieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
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
