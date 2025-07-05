import type { ButtonVariant } from "@lib/cva/button";
import button from "@lib/cva/button";
import type {
  PolyMorphicProps,
  PolyMorphicPropsWithVariants,
  VariantPropsWithout,
} from "@lib/types";
import { cn } from "@lib/utils";
import { createElement } from "react";

type ButtonProps<T extends React.ElementType> = PolyMorphicPropsWithVariants<
  T,
  typeof button
>;

function createButton(variant: ButtonVariant) {
  return <T extends React.ElementType>(
    props: PolyMorphicProps<T, VariantPropsWithout<typeof button, "variant">>
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
  const component = as || "button";
  const canDisabledInjected =
    typeof component !== "string" || ["button", "input"].includes(component);

  return createElement(component, {
    className: cn(button({ variant, size, color, disabled }), className),
    ...(canDisabledInjected ? { disabled } : {}),
    ...props,
  });
}
