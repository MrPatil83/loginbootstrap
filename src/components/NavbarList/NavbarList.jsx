// import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function NavbarList() {
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav flex-column">
            {/* Apply flex-column here for vertical stacking */}
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/map">
                Map
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
