import { Link } from "react-router-dom";

function Header() {
  return (
    <Link to="/">
      <div className="mt-4 text-4xl font-bold">Needle In Haystack</div>
    </Link>
  );
}

export default Header;
