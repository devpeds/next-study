import { cva } from "class-variance-authority";

const typography = cva("leading-normal", {
  variants: {
    typography: {
      h1: "text-5xl font-bold leading-tight",
      h2: "text-4xl font-bold leading-none",
      h3: "text-3xl font-bold leading-snug",
      h4: "text-2xl font-bold leading-snug",
      h5: "text-2xl font-bold leading-snug",
      h6: "text-2xl font-normal leading-snug",
      subtitle1: "text-lg font-normal",
      subtitle2: "text-base font-bold",
      body1: "text-lg",
      body2: "text-base",
      caption: "text-xs leading-none",
    },
  },
});

export default typography;
