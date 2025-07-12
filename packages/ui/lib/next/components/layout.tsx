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
    <body className={`${sansVariable} ${monoVariable} antialiased`}>
      <div className="relative flex flex-col min-h-screen font-sans">
        <NavBar {...navBarProps} LinkComponent={Link} />
        <main className="flex-1 flex flex-col p-8">{children}</main>
      </div>
    </body>
  );
}
