import type {
  PolyMorphicProps,
  PolyMorphicPropsWithVariants,
} from "@lib/types";
import { cn } from "@lib/utils";
import { cva } from "class-variance-authority";
import { createElement } from "react";

type TypographyProps<T extends React.ElementType> =
  PolyMorphicPropsWithVariants<T, typeof typography, "typography">;

type TypographyVariant = TypographyProps<React.ElementType>["typography"];

const typography = cva("leading-normal", {
  variants: {
    typography: {
      h1: "text-5xl font-bold leading-tight",
      h2: "text-4xl font-bold leading-none",
      h3: "text-3xl font-bold leading-snug",
      h4: "text-2xl font-bold leading-snug",
      h5: "text-2xl font-bold leading-snug",
      h6: "text-2xl font-normal leading-snug",
      subtitle1: "text-xl font-normal",
      subtitle2: "text-lg font-bold",
      body1: "text-lg",
      body2: "text-base",
      caption: "text-xs leading-none",
    },
  },
});

function createTypography<T extends React.ElementType = "p">(
  typography: TypographyVariant,
  element?: T
) {
  return <S extends React.ElementType = T>({
    as,
    ...props
  }: PolyMorphicProps<S>) => (
    <Typography typography={typography} as={as || element || "p"} {...props} />
  );
}

export const H1 = createTypography("h1", "h1");
export const H2 = createTypography("h2", "h2");
export const H3 = createTypography("h3", "h3");
export const H4 = createTypography("h4", "h4");
export const H5 = createTypography("h5", "h5");
export const H6 = createTypography("h6", "h6");
export const Subtitle1 = createTypography("subtitle1");
export const Subtitle2 = createTypography("subtitle2");
export const Body1 = createTypography("body1");
export const Body2 = createTypography("body2");
export const Caption = createTypography("caption", "span");

export function Typography<T extends React.ElementType = "p">({
  className,
  as,
  typography: t,
  ...props
}: TypographyProps<T>) {
  return createElement(as || "p", {
    className: cn(typography({ typography: t }), className),
    ...props,
  });
}
