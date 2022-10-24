import Link from "next/link";

const Navbar = ({ account }) => (
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
      {
        account && (
          <li>
            <Link
              href="/profile"
            >
              My profile
            </Link>
          </li>
        )
      }
    </ul>
  </nav>
)

export default Navbar;
