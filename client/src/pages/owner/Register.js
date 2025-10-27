import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage(res.data.message);
      setErrors({});
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-700">
          Register
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={`input ${errors.username ? "border-red-500" : ""}`}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`input ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className={`input ${errors.confirm_password ? "border-red-500" : ""}`}
        />
        {errors.confirm_password && <p className="error">{errors.confirm_password}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className={`input ${errors.phone ? "border-red-500" : ""}`}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className={`input ${errors.location ? "border-red-500" : ""}`}
        />
        {errors.location && <p className="error">{errors.location}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Register
        </button>

        {message && <p className="text-center mt-3 text-sm text-gray-700">{message}</p>}

       <div className="text-center mt-4 text-gray-600">
  Already have an account?{" "}
  <Link to="/owner-login" className="text-blue-600 font-medium">
    Sign In
  </Link>
</div>

      </form>
    </div>
  );
}
