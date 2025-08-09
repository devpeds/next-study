"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function NavigationTimer() {
  const pathname = usePathname();
  const navStart = useRef<number | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a")) {
        navStart.current = performance.now();
      }
    };

    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!navStart.current) {
        return;
      }

      const duration = performance.now() - navStart.current;
      console.log(`[NavigationTimer] ${pathname}: ${duration.toFixed(2)}ms`);
      navStart.current = null;
    });
  }, [pathname]);

  return null;
}

export default NavigationTimer;
