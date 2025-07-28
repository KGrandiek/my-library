export default function Nav() {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/stats">Stats</a></li>
        </ul>
      </div>
    </nav>
  );
}
