import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import "../../styles/create.css";

const SearchProperties = () => {
  const [formData, setFormData] = useState({
    location: "",
    min_price: "",
    max_price: "",
    property_type: "",
    property_status: "",
    min_bedrooms: "",
    min_bathrooms: "",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch property types and statuses from backend safely
    const fetchOptions = async () => {
      try {
        const res = await axios.get("/api/property/options");
        setTypes(res.data.types || ["Apartment", "Bungalow", "Mansion", "Studio"]);
        setStatuses(res.data.statuses || ["For Sale", "For Rent"]);
      } catch (error) {
        console.error("Error fetching options:", error);

        // Fallback lists in case backend is unreachable
        setTypes(["Apartment", "Bungalow", "Mansion", "Studio"]);
        setStatuses(["For Sale", "For Rent"]);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/property/search", formData);
      setProperties(res.data.properties || []);
      setErrors({});
    } catch (err) {
      if (err.response && err.response.data.errors) setErrors(err.response.data.errors);
      else console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: "1200px",
        backgroundColor: "#f9fafc",
        borderRadius: "15px",
        padding: "30px 40px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2
        className="text-center mb-4"
        style={{ fontSize: "2rem", fontWeight: "600", color: "#0d6efd" }}
      >
        Search Properties
      </h2>

      {/* Search Form */}
      <Form
        onSubmit={handleSubmit}
        className="p-4 mb-4 bg-light rounded shadow-sm"
        style={{ fontSize: "1.1rem" }}
      >
        <Row className="g-4">
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter city or area"
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                name="min_price"
                value={formData.min_price}
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                name="max_price"
                value={formData.max_price}
                onChange={handleChange}
                placeholder="e.g. 200000"
              />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Property Type</Form.Label>
              <Form.Select
                size="lg"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group>
              <Form.Label>Property Status</Form.Label>
              <Form.Select
                size="lg"
                name="property_status"
                value={formData.property_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Form.Group>
              <Form.Label>Min Bedrooms</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                name="min_bedrooms"
                value={formData.min_bedrooms}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Form.Group>
              <Form.Label>Min Bathrooms</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                name="min_bathrooms"
                value={formData.min_bathrooms}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-4 d-flex justify-content-center">
          <Button type="submit" variant="primary" size="lg">
            Search
          </Button>
        </div>
      </Form>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>Loading properties...</p>
        </div>
      )}

      {/* Properties List */}
      {!loading && (
        <Row className="mt-4">
          {properties.length > 0 ? (
            properties.map((property) => (
              <Col md={4} className="mb-4" key={property.id}>
                <Card
                  className="h-100 shadow-sm"
                  style={{ borderRadius: "12px", fontSize: "1.05rem" }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      property.thumbnail1
                        ? `/static/property_pics/${property.thumbnail1}`
                        : "/static/property_pics/default.jpg"
                    }
                    alt={property.title}
                    style={{
                      height: "220px",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  />
                  <Card.Body>
                    <Card.Title style={{ fontSize: "1.3rem", fontWeight: "600" }}>
                      {property.title}
                    </Card.Title>
                    <Card.Text>
                      {property.description
                        ? property.description.slice(0, 100)
                        : ""}
                      ...
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${property.price}
                    </Card.Text>
                    <ul className="list-inline mt-3">
                      <li className="list-inline-item">
                        <i className="fas fa-home"></i> {property.property_type}
                      </li>
                      <li className="list-inline-item">
                        <i className="fas fa-bed"></i> {property.bedrooms} bd
                      </li>
                      <li className="list-inline-item">
                        <i className="fas fa-bath"></i> {property.bathrooms} ba
                      </li>
                      <li className="list-inline-item">
                        <i className="fas fa-ruler-combined"></i> {property.size} sqft
                      </li>
                    </ul>
                    <Button
                      href={`/property/${property.id}`}
                      variant="primary"
                      size="lg"
                      className="mt-2"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center text-muted fs-5">No properties found</p>
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default SearchProperties;
