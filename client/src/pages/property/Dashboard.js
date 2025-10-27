import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Modal } from "react-bootstrap";
import "../../styles/create.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/user/properties");
        setProperties(res.data.properties);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperties();
  }, []);

  const handleDeleteClick = (url) => {
    setDeleteUrl(url);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(deleteUrl); // or delete depending on your API
      setProperties(properties.filter((p) => !deleteUrl.includes(p.id)));
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Your Properties</h2>
      <Row xs={1} md={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={
                  property.thumbnail1
                    ? `/static/property_pics/${property.thumbnail1}`
                    : "/static/property_pics/default.jpg"
                }
                alt={property.title}
              />
              <Card.Body>
                <Card.Title><strong>{property.title}</strong></Card.Title>
                <Card.Text>{property.description.slice(0, 100)}...</Card.Text>
                <Card.Text><strong>Price:</strong> ${property.price}</Card.Text>
                <ul className="list-inline mt-3">
                  <li className="list-inline-item"><i className="fas fa-home"></i> {property.property_type}</li>
                  <li className="list-inline-item"><i className="fas fa-bed"></i> {property.bedrooms} bd</li>
                  <li className="list-inline-item"><i className="fas fa-bath"></i> {property.bathrooms} ba</li>
                  <li className="list-inline-item"><i className="fas fa-ruler-combined"></i> {property.size} sqft</li>
                </ul>
                <Button
                  href={`/property/update/${property.id}`}
                  variant="primary"
                  className="me-2"
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(`/api/property/delete/${property.id}`)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this property?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
