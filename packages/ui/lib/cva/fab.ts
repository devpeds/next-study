import { cva } from "class-variance-authority";

const fab = cva("rounded-full aspect-square", {
  variants: {
    size: {
      large: "text-lg w-[56px]",
      medium: "text-base w-[48px]",
      small: "text-sm w-[40px]",
    },
  },
});

export default fab;
