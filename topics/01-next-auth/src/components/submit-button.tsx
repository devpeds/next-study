import { cn, FilledButton } from "@shared/ui";

type Props = Omit<
  React.ComponentPropsWithRef<typeof FilledButton<"button">>,
  "type" | "as"
>;

function SubmitButton({ className, ...props }: Props) {
  return (
    <FilledButton
      className={cn("font-bold", className)}
      size="large"
      color="success"
      type="submit"
      {...props}
    />
  );
}

export default SubmitButton;
