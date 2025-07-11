import type { PolyMorphicProps } from "@lib/types";
import { cn } from "@lib/utils";
import { createElement } from "react";
import ActionButton from "./action-button";
import Menu from "./menu";

export { default as ActionButton } from "./action-button";

type NavBarProps = {
  title: string;
  links?: { name: string; href: string }[];
  right?: React.ReactElement;
  LinkComponent?: React.ElementType;
};

function Title<T extends React.ElementType = "a">({
  as,
  ...props
}: PolyMorphicProps<T>) {
  return createElement(as || "a", { ...props, href: "/" });
}

export function NavBar({
  title,
  links = [],
  right,
  LinkComponent,
}: NavBarProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between sticky top-0 left-0 z-[100]",
        "pl-6 pr-4 py-4 bg-background/85 text-foreground backdrop-blur-md"
      )}
    >
      <Title className="text-2xl font-bold" as={LinkComponent}>
        {title}
      </Title>
      {(links.length > 0 || right) && (
        <Menu className="ml-6">
          <ul className="flex flex-col items-end sm:flex-row sm:items-center gap-2">
            {links.map((link) => (
              <li key={link.name} className="w-full sm:w-fit">
                <ActionButton as={LinkComponent || "a"} href={link.href}>
                  {link.name}
                </ActionButton>
              </li>
            ))}
          </ul>
          {right && (
            <div className="border-foreground/50 sm:border-l-[1px] sm:h-[24px] sm:my-auto" />
          )}
          {right}
        </Menu>
      )}
    </nav>
  );
}
