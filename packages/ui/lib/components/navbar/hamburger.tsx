import { cn } from "@lib/utils";
import ActionButton from "./action-button";

type HamburgerProps = {
  className?: string;
  open?: boolean;
  onClick?: () => void;
};

const strokeDashArray = (index: number, open: boolean): string => {
  return [
    `${open ? 90 : 60} 207`,
    `${open ? 0 : 60} 60`,
    `${open ? 90 : 60} 207`,
  ][index];
};

const strokeDashOffset = (index: number, open: boolean): number => {
  if (!open) {
    return 0;
  }

  return [-134, -30, -134][index];
};

function Hamburger({ className, open = false, onClick }: HamburgerProps) {
  return (
    <ActionButton
      className={cn("rounded-full p-1 min-w-0 size-10", className)}
      onClick={onClick}
    >
      <svg
        className={cn(
          "*:transition-[stroke-dasharray,stroke-dashoffset]",
          "*:duration-500 *:ease-[cubic-bezier(0.4, 0, 0.2, 1)]"
        )}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={6}
      >
        <path
          d={
            "M 20,29 H 80 " +
            "C 80,29 94.5,28.8 94.5,66.7 94.5,78 91,81.7 85.3,81.7 79.5,81.7 75,75 75,75 " +
            "L 25,25"
          }
          strokeDasharray={strokeDashArray(0, open)}
          strokeDashoffset={strokeDashOffset(0, open)}
        />
        <path
          d="M 20,50 H 80"
          strokeDasharray={strokeDashArray(1, open)}
          strokeDashoffset={strokeDashOffset(1, open)}
        />
        <path
          d={
            "M 20,71 H 80 " +
            "C 80,71 94.5,71.2 94.5,33.3 94.5,22 91,18.3 85.3,18.3 79.5,18.3 75,25 75,25 " +
            "L 25,75"
          }
          strokeDasharray={strokeDashArray(2, open)}
          strokeDashoffset={strokeDashOffset(2, open)}
        />
      </svg>
    </ActionButton>
  );
}

export default Hamburger;
