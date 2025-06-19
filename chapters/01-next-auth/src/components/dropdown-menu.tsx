"use client";

import { useState, useRef } from "react";
import ClickAwayListener from "./click-away-listener";

type DropdownMenuProps = {
  label: string;
  children: React.ReactNode;
};

function DropdownMenu({ label, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative inline-block">
        <button
          className="cursor-pointer px-4 py-3 font-bold hover:text-primary-400 focus:text-primary-400"
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
        </button>
        {open && (
          <ul
            className="flex flex-col absolute top-full left-0 z-[1000] rounded-md p-4 w-max max-w-[200px] list-none shadow-white shadow-sm"
            tabIndex={-1}
          >
            {children}
          </ul>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default DropdownMenu;
