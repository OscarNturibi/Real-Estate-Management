import React, { useState } from "react";
import "../../styles/owner/login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function OwnerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setMessage(data.message || "Login failed.");
        return;
      }

      const token = data.token;
      localStorage.setItem("authToken", token);

      const userData = data.owner || data; // fallback if backend returns entire profile
      login({
        role: "owner",
        email: userData.email,
        name: userData.name || "Owner",
      });

      navigate("/owner-dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="container owner-login mb-5">
      <h3>Owner Login</h3>

      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group mt-2">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="form-check mt-3">
          <input
            type="checkbox"
            name="rememberMe"
            className="form-check-input"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label className="form-check-label">Remember Me</label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg mt-3">Login</button>

        {message && <p className="text-danger text-center mt-3">{message}</p>}

        <div className="border-top mt-3 pt-4 text-center">
          <small className="text-muted">
            Don’t have an account? <a href="/owner-register">Register</a>
          </small>
        </div>
      </form>
    </div>
  );
}
