import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Home.css";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTasks,
  faChartLine,
  faUser,
  faSignInAlt,
  faMessage,
  faMoneyBillTrendUp,
  faMagnifyingGlassDollar,
  faUpload,
  faBed,
  faBath,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

const Home = ({ user, unreadCount = 0, recentProperties = [] }) => {
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("receive_message", () => {
      const badge = document.querySelector(".badge");
      if (badge) {
        let count = parseInt(badge.textContent) || 0;
        badge.textContent = count + 1;
        badge.style.display = "inline";
      }
    });
    return () => socket.disconnect();
  }, []);

  return (
    <>
      {/* Navbar */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <FontAwesomeIcon icon={faHome} /> RealtyHub
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#property" role="button" data-bs-toggle="dropdown">
                    <FontAwesomeIcon icon={faTasks} /> Property
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/create-property">Create Property</Link></li>
                    <li><Link className="dropdown-item" to="/search-properties">Search Property</Link></li>
                    <li><Link className="dropdown-item" to="/show-property/1">Show Properties</Link></li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/messages">
                    <FontAwesomeIcon icon={faMessage} /> Messages
                    {unreadCount > 0 && (
                      <span className="badge text-bg-danger ms-1">{unreadCount}</span>
                    )}
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#dashboard" data-bs-toggle="dropdown">
                    <FontAwesomeIcon icon={faChartLine} /> Dashboard
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/owner-dashboard">owner Dashboard</Link></li>
                    <li><Link className="dropdown-item" to="/tenant-dashboard">Tenant Dashboard</Link></li>
                  </ul>
                </li>

                {user ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        <FontAwesomeIcon icon={faUser} /> Profile
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/logout">
                        <FontAwesomeIcon icon={faUser} /> Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#login" data-bs-toggle="dropdown">
                      <FontAwesomeIcon icon={faSignInAlt} /> Login
                    </a>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/tenant-login">Resident Login</Link></li>
                      <li><Link className="dropdown-item" to="/owner-login">owner Login</Link></li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="text-center text-white hero-section">
        <div className="container">
          <h1 className="display-4 fw-bold">Find Your Perfect Home</h1>
          <p className="lead mb-4">Buy, rent, or list properties easily with RealtyHub.</p>
          <div className="hero-buttons">
            <Link to="/search-properties" className="btn btn-light btn-lg me-3">
              <FontAwesomeIcon icon={faMagnifyingGlassDollar} /> Search Properties
            </Link>
            <Link to="/owner-benefit" className="btn btn-outline-light btn-lg">
              <FontAwesomeIcon icon={faMoneyBillTrendUp} /> owner Benefits
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured-properties" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Featured Properties</h2>
          <div className="row">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div key={property.id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        property.thumbnail1
                          ? `/static/property_pics/${property.thumbnail1}`
                          : `/static/property_pics/default.jpg`
                      }
                      className="card-img-top"
                      alt={property.title}
                    />
                    <div className="card-body">
                      <h4 className="card-title fw-bold">{property.title}</h4>
                      <p className="card-text text-muted">{property.property_status}</p>
                      <p className="card-text">{property.description.slice(0, 100)}...</p>
                      <p><strong>Price:</strong> ${property.price}</p>
                      <ul className="list-inline small text-muted">
                        <li className="list-inline-item"><FontAwesomeIcon icon={faBed} /> {property.bedrooms} bd</li>
                        <li className="list-inline-item"><FontAwesomeIcon icon={faBath} /> {property.bathrooms} ba</li>
                        <li className="list-inline-item"><FontAwesomeIcon icon={faRulerCombined} /> {property.size} sqft</li>
                      </ul>
                      <Link to={`/view-property/${property.id}`} className="btn btn-primary w-100">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No properties available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>RealtyHub</h5>
              <p>Connecting you with your dream home, one click at a time.</p>
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
                <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                <li className="list-inline-item"><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/owner-benefit">owners/Investors</Link></li>
                <li><Link to="/tenant-dashboard">Residents</Link></li>
                <li><Link to="/search-properties">Rentals</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact</h5>
              <p>123 Realty Lane, Ikeja, Lagos, Nigeria<br />info@realtyhub.com<br />555-123-4567</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
