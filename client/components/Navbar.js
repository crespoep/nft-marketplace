import Link from "next/link";

const Navbar = () => (
  <nav className="hidden md:block">
    <ul className="flex">
      <li className="mr-4 text-black">
        <Link
          href="/"
        >
          Home
        </Link>
      </li>
      <li className="mr-4 text-black">
        <Link
          href="/about"
        >
          About
        </Link>
      </li>
    </ul>
  </nav>
)

export default Navbar;
