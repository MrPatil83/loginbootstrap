// import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from "../../assets/Logo/logo.png"; // Ensure correct path to your logo
import NavbarList from "../NavbarList/NavbarList";

export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left-side Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Right-side Login Button wrapped with Link */}
          <div className="d-flex align-items-center ms-auto">
            {/* Link to /login page */}
            <Link to="/login">
              <button className="btn btn-primary" type="button">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            <img
              src={Logo}
              alt="logo"
              style={{ height: 70, width: 70, objectFit: "cover" }}
            />
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          {/* Navbar Open */}
          <NavbarList />
          {/* Navbar Close */}
        </div>
      </div>
    </>
  );
}
