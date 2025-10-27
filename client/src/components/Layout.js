import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Minimal FlashMessages placeholder
const FlashMessages = () => {
  return null; // replace with actual flash messages if needed
};

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Flash messages */}
      <div className="container mt-4">
        <FlashMessages />
      </div>

      {/* Page content */}
      <div className="container mt-3 flex-grow-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
