import React from "react";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content text-center">
          <h1 className="hero-title">Find Your Dream Home</h1>
          <p className="hero-subtitle">Discover the best properties for rent and sale near you</p>
          <a href="/search-properties" className="btn btn-warning btn-lg mt-3">
            Browse Listings
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
