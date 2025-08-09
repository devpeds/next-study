import { NavBar } from "@lib/components/navbar";
import Link from "next/link";

type NavBarProps = Omit<
  React.ComponentPropsWithoutRef<typeof NavBar>,
  "LinkComponent" | "className"
>;

type LayoutProps = NavBarProps & {
  sansVariable: string;
  monoVariable: string;
  children: React.ReactNode;
};

export function Layout({
  sansVariable,
  monoVariable,
  children,
  ...navBarProps
}: LayoutProps) {
  return (
    <body
      className={`${sansVariable} ${monoVariable} antialiased overflow-x-hidden`}
    >
      <div className="relative flex flex-col min-h-screen font-sans">
        <NavBar {...navBarProps} LinkComponent={Link} />
        <div className="flex-1 flex flex-col p-8">{children}</div>
      </div>
    </body>
  );
}
