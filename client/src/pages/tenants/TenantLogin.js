import React, { useState } from "react";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const TenantLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : ""
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tenant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Invalid login details.");
        return;
      }

      const token = data.token;
      localStorage.setItem("authToken", token);

      const userData = data.tenant || data;
      login({
        role: "tenant",
        email: userData.email,
        name: userData.name || "Tenant",
      });

      navigate("/tenant-dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="container">
      <h3>Tenant Login</h3>

      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group mt-2">
          <label>Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label">Remember Me</label>
        </div>

        <button type="submit" className="btn btn-primary btn-lg mt-3">
          Login
        </button>

        {message && <p className="text-danger mt-3 text-center">{message}</p>}

        <div className="border-top mt-3 pt-4 text-center">
          <small className="text-muted">
            Not registered yet? <Link to="/tenant-register">Sign Up</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default TenantLogin;
