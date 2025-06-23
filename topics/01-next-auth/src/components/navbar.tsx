import Link from "next/link";
import AuthButton from "./auth-button";
import DropdownMenu from "./dropdown-menu";

type Menu = { name: string; children: { name: string; href: string }[] };

const menus: Menu[] = [];

function NavBar() {
  return (
    <nav className="flex items-center justify-between sticky top-0 left-0 z-[100] space-x-6 px-6 py-4 bg-black text-white">
      <Link href="/" className="text-lg font-bold">
        NextAuth.js Example
      </Link>
      <div className="flex space-x-6 list-none">
        <ul className="flex space-x-2">
          {menus.map((menu) => (
            <li key={menu.name}>
              <DropdownMenu label={menu.name}>
                {menu.children.map((child) => (
                  <Link
                    key={child.name}
                    className="p-2 font-bold hover:text-primary-400 focus:text-primary-400"
                    href={child.href}
                  >
                    {child.name}
                  </Link>
                ))}
              </DropdownMenu>
            </li>
          ))}
        </ul>
        <div className="bg-white border-l-[1px] h-[24px] my-auto" />
        <AuthButton />
      </div>
    </nav>
  );
}

export default NavBar;
