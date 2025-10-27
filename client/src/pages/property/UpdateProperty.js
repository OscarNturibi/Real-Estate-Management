import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/create.css"; // reuse the same CSS

const UpdateProperty = ({ propertyId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    property_type: "",
    property_status: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    available_from: "",
    thumbnail1: null,
    thumbnail2: null,
    thumbnail3: null,
  });

  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState({});

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/property/${propertyId}`);
        const property = res.data;
        setFormData({
          title: property.title || "",
          description: property.description || "",
          price: property.price || "",
          location: property.location || "",
          property_type: property.property_type || "",
          property_status: property.property_status || "",
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          size: property.size || "",
          available_from: property.available_from || "",
          thumbnail1: null,
          thumbnail2: null,
          thumbnail3: null,
        });
        setExistingImages({
          thumbnail1: property.thumbnail1 || "",
          thumbnail2: property.thumbnail2 || "",
          thumbnail3: property.thumbnail3 || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post(`/api/property/update/${propertyId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      setErrors({});
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Property</h2>
      <form className="row g-3" onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Map through form fields */}
        {[
          { name: "title", label: "Title", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "price", label: "Price", type: "number" },
          { name: "location", label: "Location", type: "text" },
          { name: "property_type", label: "Property Type", type: "text" },
          { name: "property_status", label: "Property Status", type: "text" },
          { name: "bedrooms", label: "Bedrooms", type: "number" },
          { name: "bathrooms", label: "Bathrooms", type: "number" },
          { name: "size", label: "Size", type: "text" },
          { name: "available_from", label: "Available From", type: "date" },
        ].map((field, idx) => (
          <div className={`form-group col-md-4 mt-3`} key={idx}>
            <label>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                rows="5"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ) : (
              <input
                type={field.type}
                className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
            {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
          </div>
        ))}

        {/* Image uploads */}
        {["thumbnail1", "thumbnail2", "thumbnail3"].map((img, idx) => (
          <div className="form-group col-md-4 mt-3" key={idx}>
            <label>{`Thumbnail ${idx + 1}`}</label>
            <input
              type="file"
              className={`form-control ${errors[img] ? "is-invalid" : ""}`}
              name={img}
              onChange={handleChange}
            />
            {errors[img] && <div className="invalid-feedback">{errors[img]}</div>}
            {existingImages[img] && (
              <img src={`/static/property_pics/${existingImages[img]}`} alt={`Thumbnail ${idx + 1}`} className="img-thumbnail mt-2" />
            )}
          </div>
        ))}

        {/* Submit */}
        <div className="form-group mt-3">
          <button type="submit" className="btn btn-primary">
            Update Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProperty;
