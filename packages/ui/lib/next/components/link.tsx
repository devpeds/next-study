import button from "@lib/cva/button";
import { cn } from "@lib/utils";
import type { VariantProps } from "class-variance-authority";
import NextLink from "next/link";

type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link({ className, ...props }: LinkProps) {
  return (
    <NextLink className={cn("underline text-blue-400", className)} {...props} />
  );
}

type LinkButtonProps = LinkProps & VariantProps<typeof button>;

export function LinkButton({
  className,
  variant = "text",
  size,
  color = "info",
  disabled,
  ...props
}: LinkButtonProps) {
  return (
    <NextLink
      className={cn(button({ variant, size, color, disabled }), className)}
      {...props}
    />
  );
}
