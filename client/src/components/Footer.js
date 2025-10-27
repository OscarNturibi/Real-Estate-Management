// src/components/Footer.js
import React from "react";
import "../components/Navbar.css"; // if you put shared CSS here

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} RealtyHub. All Rights Reserved.
        </p>
        <p className="small">
          <a href="/about" className="text-white text-decoration-none me-3">
            About
          </a>
          <a href="/contact" className="text-white text-decoration-none">
            Contact
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
