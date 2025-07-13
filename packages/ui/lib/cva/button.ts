import { cva, cx } from "class-variance-authority";

export type ButtonVariant = (typeof variants)[number];
export type ButtonColor = (typeof colors)[number];

const variants = ["filled", "outlined", "text"] as const;

const colors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warn",
  "error",
] as const;

function pickClass(
  variant: ButtonVariant,
  color: ButtonColor,
  disabled?: boolean,
) {
  const isPrimary = color === "primary";
  const isSecondary = color === "secondary";
  const isSuccess = color === "success";
  const isInfo = color === "info";
  const isWarn = color === "warn";
  const isError = color === "error";

  return cx(
    variant === "filled" && {
      "text-white": true,
      "bg-blue-600": isPrimary,
      "hover:bg-blue-600/75": !disabled && isPrimary,
      "bg-purple-600": isSecondary,
      "hover:bg-purple-600/75": !disabled && isSecondary,
      "bg-green-600": isSuccess,
      "hover:bg-green-600/75": !disabled && isSuccess,
      "bg-sky-600": isInfo,
      "hover:bg-sky-600/75": !disabled && isInfo,
      "bg-yellow-600": isWarn,
      "hover:bg-yellow-600/75": !disabled && isWarn,
      "bg-red-700": isError,
      "hover:bg-red-700/75": !disabled && isError,
    },
    variant !== "filled" && {
      "hover:outline-[1.5px]": !disabled && variant === "outlined",
      "text-blue-600": isPrimary,
      "border-blue-600": isPrimary,
      "hover:bg-blue-600/15": !disabled && isPrimary,
      "text-purple-600": isSecondary,
      "border-purple-600": isSecondary,
      "hover:bg-purple-600/15": !disabled && isSecondary,
      "text-green-600": isSuccess,
      "border-green-600": isSuccess,
      "hover:bg-green-600/15": !disabled && isSuccess,
      "text-sky-600": isInfo,
      "border-sky-600": isInfo,
      "hover:bg-sky-600/15": !disabled && isInfo,
      "text-yellow-600": isWarn,
      "border-yellow-600": isWarn,
      "hover:bg-yellow-600/15": !disabled && isWarn,
      "text-red-700": isError,
      "border-red-700": isError,
      "hover:bg-red-700/15": !disabled && isError,
    },
  );
}

const button = cva(
  "cursor-pointer flex items-center justify-center min-w-[64px] font-medium",
  {
    variants: {
      variant: {
        filled: null,
        outlined: "outline-1",
        text: null,
      },
      size: {
        large: "text-lg rounded-lg px-5 py-3",
        medium: "text-base rounded-md px-3 py-2",
        small: "text-sm rounded-sm px-2 py-1",
      },
      color: {
        primary: null,
        secondary: null,
        success: null,
        info: null,
        warn: null,
        error: null,
      },
      disabled: {
        true: "cursor-not-allowed",
        false: null,
      },
    },
    compoundVariants: [
      ...variants.flatMap((variant) => [
        ...colors.map((color) => ({
          variant,
          color,
          disabled: false,
          class: pickClass(variant, color),
        })),
        ...colors.map((color) => ({
          variant,
          color,
          disabled: true,
          class: pickClass(variant, color, true),
        })),
      ]),
    ],
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "medium",
      disabled: false,
    },
  },
);

export default button;
