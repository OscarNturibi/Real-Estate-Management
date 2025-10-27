import React, { useState } from 'react';
import '../../styles/updates.css';

const TenantProfileUpdate = ({ currentUser }) => {
  // Initialize state with current user info
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    picture: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(currentUser?.image_file || '/default.jpg');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture' && files.length > 0) {
      setFormData({ ...formData, picture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Simple validation
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: API call to update profile
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    if (formData.picture) data.append('picture', formData.picture);

    console.log('FormData ready to send:', data);

    // Optionally, refresh user profile or give feedback
  };

  return (
    <div className="container">
      <h2 className="mt-4">Account</h2>
      <div className="row">
        <div className="col-md-4">
          <img
            src={preview}
            alt="Profile"
            className="rounded mx-auto d-block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <div className="col-md-8">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            {/* Email */}
            <div className="form-group mt-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Profile Picture */}
            <div className="form-group mt-2">
              <label>Profile Picture</label>
              <input
                type="file"
                name="picture"
                className="form-control-file"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary mt-3 row-cols-7 d-flex justify-content-center"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantProfileUpdate;
