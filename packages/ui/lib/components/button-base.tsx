import type { PolyMorphicProps } from "@lib/types";
import { cn } from "@lib/utils";
import { createElement } from "react";

type ButtonBaseProps<T extends React.ElementType> = PolyMorphicProps<
  T,
  { disabled?: boolean | null }
>;

export function ButtonBase<T extends React.ElementType = "button">({
  className,
  as,
  disabled,
  ...props
}: ButtonBaseProps<T>) {
  const component = as || "button";
  const canDisabledInjected =
    typeof component !== "string" || ["button", "input"].includes(component);

  return createElement(component, {
    className: cn(
      "cursor-pointer flex items-center justify-center font-medium",
      disabled && "cursor-not-allowed",
      className,
    ),
    ...(canDisabledInjected ? { disabled } : {}),
    ...props,
  });
}
