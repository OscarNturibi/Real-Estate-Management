import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaEnvelope,
  FaUser,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaPhone,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();

  const incomeData = [
    { name: "Jun", income: 450000 },
    { name: "Jul", income: 520000 },
    { name: "Aug", income: 610000 },
    { name: "Sep", income: 700000 },
    { name: "Oct", income: 647890 },
    { name: "Nov", income: 580000 },
    { name: "Dec", income: 630000 },
  ];

  const mostViewed = [
    {
      id: 1,
      title: "Maple Ridge Villa",
      location: "Nairobi, KE",
      price: "KSh 3.5M",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
    },
    {
      id: 2,
      title: "Golden Coast Residences",
      location: "Mombasa, KE",
      price: "KSh 800k/mo",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600",
    },
    {
      id: 3,
      title: "Lakeshore Estate",
      location: "Naivasha, KE",
      price: "KSh 2.7M",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    },
  ];

  const interestedProperties = [
    {
      id: 1,
      title: "Lakeshore Estate",
      location: "Naivasha, KE",
      image:
        "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600",
      details: "4 Beds · 3 Baths · 2 Floors",
    },
    {
      id: 2,
      title: "Cedarwood Estates",
      location: "Karen, Nairobi",
      image:
        "https://images.unsplash.com/photo-1600585154203-2079d1285b3d?w=600",
      details: "5 Beds · 4 Baths · 1 Floor",
    },
    {
      id: 3,
      title: "Orchard Park House",
      location: "Runda, Nairobi",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
      details: "3 Beds · 2 Baths · 3 Floors",
    },
  ];

  useEffect(() => {
    const profile = localStorage.getItem("ownerProfile");
    if (profile) {
      setOwner(JSON.parse(profile));
    } else {
      const token = localStorage.getItem("ownerToken");
      if (!token) {
        navigate("/owner-login");
        return;
      }

      fetch("http://localhost:5000/api/owner/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setOwner(data))
        .catch(() => navigate("/owner-login"));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerProfile");
    navigate("/owner-login");
  };

  if (!owner) {
    return (
      <div className="text-center mt-10 text-lg font-medium text-gray-700">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm flex items-center justify-between px-10 py-3 z-50">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <FaHome /> RealtyHub
        </div>
        <ul className="flex items-center gap-8 text-gray-600 font-medium">
          <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
          <li><Link to="/properties" className="hover:text-blue-600">Properties</Link></li>
          <li><Link to="/agents" className="hover:text-blue-600">Agents</Link></li>
          <li><Link to="/clients" className="hover:text-blue-600">Clients</Link></li>
          <li><Link to="/messages" className="hover:text-blue-600 flex items-center gap-1"><FaEnvelope /> Messages</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border"
          />
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-500 flex items-center gap-1"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 px-10 grid grid-cols-12 gap-6">
        {/* Left: Owner Card */}
        <div className="col-span-4 bg-white p-6 rounded-2xl shadow">
          <div className="text-center">
            <img
              src="https://via.placeholder.com/120"
              alt="Owner"
              className="mx-auto rounded-full border shadow-sm"
            />
            <h2 className="text-xl font-semibold mt-3">{owner.username}</h2>
            <p className="text-gray-500 text-sm">{owner.email}</p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2 mt-1">
              <FaPhone /> +254-700-000000
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mt-6">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm text-gray-600">All Properties</p>
              <p className="font-semibold text-xl">8</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-sm text-gray-600">For Rent</p>
              <p className="font-semibold text-xl">4</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mt-4 text-center">
            <p className="text-sm text-gray-600">Invested Property</p>
            <p className="font-semibold text-xl text-blue-600">KSh 359K</p>
          </div>

          <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-xl w-full hover:bg-blue-700 transition">
            Send Message
          </button>
        </div>

        {/* Right: Charts & Property Highlights */}
        <div className="col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Total Income</h3>
              <span className="text-sm text-gray-500">Last 7 months</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">Most Viewed Properties</h3>
            <div className="grid grid-cols-3 gap-4">
              {mostViewed.map((p) => (
                <div key={p.id} className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={p.image} alt={p.title} className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <h4 className="font-medium">{p.title}</h4>
                    <p className="text-gray-500 text-sm">{p.location}</p>
                    <p className="text-blue-600 font-semibold mt-1">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-3">Interested Properties</h3>
            <div className="grid grid-cols-3 gap-4">
              {interestedProperties.map((prop) => (
                <div key={prop.id} className="rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={prop.image} alt={prop.title} className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <h4 className="font-medium">{prop.title}</h4>
                    <p className="text-gray-500 text-sm">{prop.location}</p>
                    <p className="text-gray-600 text-xs mt-1">{prop.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm mt-8 pb-4">
        © 2025 RealtyHub — Privacy Policy · Terms · Contact
      </footer>
    </div>
  );
}
