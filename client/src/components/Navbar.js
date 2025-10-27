import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    const navbarCollapse = document.getElementById("navbarNavDropdown");
    if (navbarCollapse?.classList.contains("show")) {
      new window.bootstrap.Collapse(navbarCollapse).toggle();
    }
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".custom-navbar");
      if (!navbar) return;
      if (window.scrollY > 20) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="navbar navbar-expand-lg fixed-top shadow-sm bg-white py-2 border-bottom">
      <div className="container-fluid px-4">
        {/* Left: Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center text-primary fs-4" to="/">
          <i className="fas fa-building me-2"></i> RealtyHub
        </Link>

        {/* Center: Nav Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
          <ul className="navbar-nav gap-3 align-items-center fw-semibold">
            <li><Link className={`nav-link ${isActive("/dashboard") ? "text-primary" : "text-secondary"}`} to="/dashboard">Dashboard</Link></li>
            <li><Link className="nav-link text-secondary" to="/properties">Properties</Link></li>
            <li><Link className="nav-link text-secondary" to="/agents">Agents</Link></li>
            <li><Link className={`nav-link ${isActive("/clients") ? "text-primary" : "text-secondary"}`} to="/clients">Clients</Link></li>
            <li><Link className="nav-link text-secondary" to="/transactions">Transactions</Link></li>
            <li><Link className="nav-link text-secondary" to="/reviews">Reviews</Link></li>
            <li>
              <Link className="nav-link position-relative text-secondary" to="/messages">
                Messages
                <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">5</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right: Icons + Profile */}
        <div className="d-flex align-items-center gap-3">
          {/* Search Icon */}
          <button className="btn btn-light rounded-circle shadow-sm border-0">
            <i className="fas fa-search text-muted"></i>
          </button>

          {/* Notifications */}
          <button className="btn btn-light rounded-circle shadow-sm border-0 position-relative">
            <i className="fas fa-bell text-muted"></i>
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle">!</span>
          </button>

          {/* Settings */}
          <button className="btn btn-light rounded-circle shadow-sm border-0">
            <i className="fas fa-cog text-muted"></i>
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn d-flex align-items-center border-0 bg-white"
              data-bs-toggle="dropdown"
            >
              <img
                src="https://ui-avatars.com/api/?name=Milla+Willow"
                alt="Profile"
                className="rounded-circle me-2"
                width="36"
                height="36"
              />
              <span className="fw-semibold text-secondary">Milla Willow</span>
              <i className="fas fa-chevron-down ms-2 text-muted"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li><Link className="dropdown-item" to="/tenant-profile">My Profile</Link></li>
              <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
              {isAuthenticated ? (
                <li><Link className="dropdown-item text-danger" to="/logout">Logout</Link></li>
              ) : (
                <li><Link className="dropdown-item" to="/owner-login">Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
