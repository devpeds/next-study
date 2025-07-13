"use client";

import { cn } from "@lib/utils";
import { useState } from "react";

import Hamburger from "./hamburger";

function Menus({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "absolute top-[72px] right-0 flex flex-col items-end gap-3",
          "sm:static sm:flex-row sm:items-center",
          "max-sm:bg-background/90 max-sm:min-h-[calc(100svh-72px)]",
          open ? "max-sm:translate-x-0" : "max-sm:translate-x-full",
          "max-sm:duration-300 max-sm:ease-in-out max-sm:*:w-full",
          className
        )}
      >
        {children}
      </div>
      <Hamburger
        className={cn("sm:hidden", className)}
        open={open}
        onClick={() => setOpen(!open)}
      />
    </>
  );
}

export default Menus;
