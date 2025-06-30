import Link from "next/link";
import AuthButton from "./auth-button";

type Menu = {
  name: string;
  href: string;
};

const menus: Menu[] = [{ name: "Show DB", href: "db" }];

function NavBar() {
  return (
    <nav className="flex items-center justify-between sticky top-0 left-0 z-[100] space-x-6 px-6 py-4 bg-black text-white">
      <Link href="/" className="text-lg font-bold">
        Auth.js Example
      </Link>
      <div className="flex space-x-6 list-none">
        <ul className="flex space-x-2">
          {menus.map((menu) => (
            <li key={menu.name}>
              <Link
                className="p-2 font-bold hover:text-primary-400 focus:text-primary-400"
                href={menu.href}
              >
                {menu.name}
              </Link>
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
