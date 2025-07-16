import type { ButtonVariant } from "@lib/cva/button";
import button from "@lib/cva/button";
import type {
  PolyMorphicProps,
  PolyMorphicPropsWithVariants,
  VariantPropsWithout,
} from "@lib/types";
import { cn } from "@lib/utils";

import { ButtonBase } from "./button-base";

type ButtonProps<T extends React.ElementType> = PolyMorphicPropsWithVariants<
  T,
  typeof button
>;

function createButton(variant: ButtonVariant) {
  return <T extends React.ElementType>(
    props: PolyMorphicProps<T, VariantPropsWithout<typeof button, "variant">>,
  ) => {
    return <Button {...props} variant={variant} />;
  };
}

export const FilledButton = createButton("filled");
export const OutlinedButton = createButton("outlined");
export const TextButton = createButton("text");

export function Button<T extends React.ElementType = "button">({
  as,
  className,
  variant,
  size,
  color,
  disabled,
  ...props
}: ButtonProps<T>) {
  return (
    <ButtonBase
      as={as || "button"}
      className={cn(
        button({ variant, size, color, disabled }),
        "min-w-[64px]",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
