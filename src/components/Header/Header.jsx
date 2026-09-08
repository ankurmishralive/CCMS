import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const menuItems = [
  { label: "Customer Service Executive", path: "/customer-service-executive" },
  { label: "Complaint Supervisor", path: "/complaint-supervisor" },
  { label: "Complaint Manager", path: "/complaint-manager" },
  { label: "Support Engineer", path: "/support-engineer" },
  { label: "Team Lead", path: "/team-lead" },
  { label: "Customer", path: "/customer" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeMenuOnEscape);
    return () => document.removeEventListener("keydown", closeMenuOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="brand"
          to="/"
          aria-label="CCMS home"
          onClick={closeMenu}
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">CCMS</span>
        </Link>
        <button
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span />
          <span />
          <span />
        </button>
        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <div className="navigation-heading">Workspace roles</div>
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) => (isActive ? "active" : undefined)}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
