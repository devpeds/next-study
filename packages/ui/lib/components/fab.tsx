import button from "@lib/cva/button";
import fab from "@lib/cva/fab";
import type { PolyMorphicProps, VariantPropsWithout } from "@lib/types";
import { cn } from "@lib/utils";
import type { VariantProps } from "class-variance-authority";

import { ButtonBase } from "./button-base";

type FabVariants = VariantProps<typeof fab> &
  VariantPropsWithout<typeof button, "variant" | "size">;

type FabProps<T extends React.ElementType> = PolyMorphicProps<T, FabVariants>;

export function Fab<T extends React.ElementType = "button">({
  className,
  as,
  color,
  size,
  disabled,
  ...props
}: FabProps<T>) {
  return (
    <ButtonBase
      className={cn(
        button({ variant: "filled", color, disabled }),
        fab({ size }),
        className,
      )}
      as={as || "button"}
      disabled={disabled}
      {...props}
    />
  );
}
