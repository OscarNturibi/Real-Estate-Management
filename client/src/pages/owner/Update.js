import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/updates.css"; // From owner/static/updates.css
import Layout from '../../components/Layout';

const Update = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Fetch owner data from Flask API
  useEffect(() => {
    fetch("http://localhost:5000/api/owner/profile")
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          username: data.username || "",
          email: data.email || "",
          picture: null,
        });
        setImagePreview(data.image_url || "/default.jpg");
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  // ✅ Handle form text changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle file uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, picture: file });
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // ✅ Submit to Flask backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    if (formData.picture) formDataToSend.append("picture", formData.picture);

    fetch("http://localhost:5000/api/owner/update", {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => alert(data.message || "Profile updated successfully!"))
      .catch((err) => console.error("Update failed:", err));
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="mt-4 text-center">Agent Account</h2>
        <div className="row align-items-center mt-4">
          <div className="col-md-4 text-center">
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded mx-auto d-block profile-img"
            />
          </div>

          <div className="col-md-8">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label className="form-control-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-control-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-control-label">Profile Picture</label>
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control-file"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-4 d-flex justify-content-center"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Update;
