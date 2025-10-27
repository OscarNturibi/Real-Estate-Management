import React, { useState } from 'react';
import '../../styles/logins.css';
import { Link, useNavigate } from 'react-router-dom';

const TenantRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.location) newErrors.location = 'Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: send formData to backend API
    console.log(formData);

    // On success, navigate to login
    navigate('/login');
  };

  return (
    <div className="container">
      <h3>Join the fun and sign up today!</h3>
      <form onSubmit={handleSubmit} className="mx-auto">
        {['username', 'email', 'password', 'confirmPassword', 'phone', 'location'].map((field) => (
          <div className="form-group mt-2" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1).replace('confirmPassword', 'Confirm Password')}</label>
            <input
              type={field.toLowerCase().includes('password') ? 'password' : 'text'}
              name={field}
              className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
          </div>
        ))}

        <div className="form-group mt-2 row">
          <button type="submit" className="btn btn-primary btn-lg mt-3">
            Sign Up
          </button>
        </div>

        <div className="border-top mt-2 pt-2 text-center">
          <small className="text-muted">
            Already Have An Account? <Link className="ml-2" to="/login">Sign In</Link>
          </small>
        </div>
      </form>
    </div>
  );
};

export default TenantRegister;
