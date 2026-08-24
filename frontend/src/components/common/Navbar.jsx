import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <Link to="/" className="font-bold text-slate-900">SmartciviConnect</Link>
    </header>
  );
}

export default Navbar;
