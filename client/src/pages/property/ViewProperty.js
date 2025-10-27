import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { Carousel, Card, Form, Button } from "react-bootstrap";
import "../../styles/create.css";

const ViewProperty = ({ currentUserId }) => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState({});
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interested: false,
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/property/${propertyId}`);
        setProperty(res.data.property);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("authentication_error", (data) => {
      alert(data.message);
    });

    newSocket.on("receive_message", (data) => {
      console.log("Message received:", data);
      // Optionally, update a messages list state here
    });

    return () => newSocket.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactForm({
      ...contactForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket) return;

    const messageData = {
      sender_id: currentUserId,
      receiver_id: property.owner_id,
      property_id: property.id,
      ...contactForm,
    };

    socket.emit("send_message", messageData);

    setContactForm({
      name: "",
      email: "",
      phone: "",
      message: "",
      interested: false,
    });
  };

  const images = [property.image1, property.image2, property.image3].filter(Boolean);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <Card>
            {images.length > 0 && (
              <Carousel>
                {images.map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      className="d-block w-100"
                      src={`/static/property_pics/${img}`}
                      alt={`Property image ${idx + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}

            <Card.Body className="mt-3">
              <Card.Title><strong>{property.title}</strong></Card.Title>
              <Card.Text>{property.description}</Card.Text>
              <Card.Text><strong>Price:</strong> ${property.price}</Card.Text>
              <Card.Text><strong>Location:</strong> {property.location}</Card.Text>
              <ul className="list-inline mt-3">
                <li className="list-inline-item"><i className="fas fa-home"></i> {property.property_type}</li>
                <li className="list-inline-item"><i className="fas fa-bed"></i> {property.bedrooms} Bedrooms</li>
                <li className="list-inline-item"><i className="fas fa-bath"></i> {property.bathrooms} Bathrooms</li>
                <li className="list-inline-item"><i className="fas fa-ruler-combined"></i> {property.size} sqft</li>
              </ul>
            </Card.Body>
          </Card>
        </div>

        {/* Contact and Share */}
        <div className="col-md-4">
          <h3>Share</h3>
          <p>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer">Facebook</a> |{" "}
            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noreferrer">Twitter</a> |{" "}
            <a href={`https://pinterest.com/pin/create/button/?url=${window.location.href}`} target="_blank" rel="noreferrer">Pinterest</a>
          </p>

          <h3>Contact Agent</h3>
          <Form className="mt-5" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={contactForm.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={contactForm.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="interested">
              <Form.Check
                type="checkbox"
                label="I am interested in this property."
                name="interested"
                checked={contactForm.interested}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="d-flex justify-content-center">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ViewProperty;
