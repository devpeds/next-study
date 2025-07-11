import { cn } from "@lib/utils";
import { TextButton } from "../button";
import type { PolyMorphicProps } from "@lib/types";

type ActionButtonProps<T extends React.ElementType> = PolyMorphicProps<T>;

function ActionButton<T extends React.ElementType = "button">(
  props: ActionButtonProps<T>
) {
  return (
    <TextButton
      {...props}
      className={cn(
        "font-bold text-inherit justify-end px-6 rounded-none",
        "sm:justify-center sm:px-3 sm:rounded-md",
        "hover:text-blue-400 focus:text-blue-400",
        "hover:bg-blue-400/10 focus:bg-blue-400/10",
        props.className
      )}
    />
  );
}

export default ActionButton;
