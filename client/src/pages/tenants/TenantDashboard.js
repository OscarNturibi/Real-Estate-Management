import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TenantDashboard = () => {
  const [rentedProperties, setRentedProperties] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchDashboardData = async () => {
      // Mock data for now
      setRentedProperties([
        { id: 1, title: 'Ocean View Apartment', location: 'Nairobi', price: 50000 },
        { id: 2, title: 'City Center Condo', location: 'Nairobi', price: 75000 },
      ]);

      setMessages([
        { id: 1, sender: 'owner John', content: 'Your application was approved!' },
        { id: 2, sender: 'owner Mary', content: 'Property visit scheduled for tomorrow.' },
      ]);
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    // TODO: Call API to logout if needed
    navigate('/login');
  };

  return (
    <div>
      {/* Sidebar */}
      <nav className="sidebar">
        <a href="#" className="logo">
          <img src="/logo.jpg" alt="logo" />
          <span>Dashboard</span>
        </a>
        <ul>
          <li>
            <a href="#">
              <FaHome /> Home
            </a>
          </li>
          <li>
            <a href="#">
              <FaUser /> Profile
            </a>
          </li>
          <li>
            <a href="#" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <h2>Rented Properties</h2>
        <ul>
          {rentedProperties.length === 0 ? (
            <li>No rented properties</li>
          ) : (
            rentedProperties.map((property) => (
              <li key={property.id}>
                <strong>{property.title}</strong> - {property.location} - KES {property.price}
              </li>
            ))
          )}
        </ul>

        <h2>Messages</h2>
        <ul>
          {messages.length === 0 ? (
            <li>No messages</li>
          ) : (
            messages.map((msg) => (
              <li key={msg.id}>
                <strong>{msg.sender}:</strong> {msg.content}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TenantDashboard;
