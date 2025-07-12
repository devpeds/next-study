import type { cva, VariantProps } from "class-variance-authority";

type Cva = ReturnType<typeof cva>;

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type ExtendedVariantProps<
  T extends Cva,
  K extends keyof VariantProps<T> = never
> = [K] extends [never]
  ? VariantProps<T>
  : Omit<VariantProps<T>, K> & { [P in K]: NonNullable<VariantProps<T>[K]> };

export type VariantPropsWithout<
  T extends Cva,
  K extends keyof VariantProps<T>
> = Pick<VariantProps<T>, Exclude<keyof VariantProps<T>, K>>;

export type PolyMorphicProps<
  T extends React.ElementType,
  Props = object
> = AsProp<T> & React.ComponentPropsWithoutRef<T> & Props;

export type PolyMorphicPropsWithVariants<
  T extends React.ElementType,
  U extends Cva,
  K extends keyof VariantProps<U> = never
> = PolyMorphicProps<T> & ExtendedVariantProps<U, K>;
