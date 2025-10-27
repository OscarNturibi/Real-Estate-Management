import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Pagination } from "react-bootstrap";
import "../../styles/create.css";

const ShowProperties = () => {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
  });

  // Fetch properties
  const fetchProperties = async (page = 1) => {
    try {
      const res = await axios.get(`/api/properties?page=${page}`);
      setProperties(res.data.properties);
      setPagination({
        page: res.data.page,
        total_pages: res.data.total_pages,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperties(pagination.page);
  }, []);

  const handlePageChange = (pageNum) => {
    fetchProperties(pageNum);
  };

  const renderPagination = () => {
    let items = [];
    for (let i = 1; i <= pagination.total_pages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === pagination.page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return (
      <Pagination className="justify-content-center mt-4">
        {pagination.page > 1 && (
          <Pagination.Prev onClick={() => handlePageChange(pagination.page - 1)} />
        )}
        {items}
        {pagination.page < pagination.total_pages && (
          <Pagination.Next onClick={() => handlePageChange(pagination.page + 1)} />
        )}
      </Pagination>
    );
  };

  return (
    <div className="container mt-5">
      <h2>Properties</h2>
      <Row xs={1} md={3} className="g-4">
        {properties.length > 0 ? (
          properties.map((property) => (
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
                  <Card.Text><strong>{property.property_status}</strong></Card.Text>
                  <Card.Text>{property.description.slice(0, 100)}...</Card.Text>
                  <Card.Text><strong>Price:</strong> ${property.price}</Card.Text>
                  <ul className="list-inline mt-3">
                    <li className="list-inline-item"><i className="fas fa-home"></i> {property.property_type}</li>
                    <li className="list-inline-item"><i className="fas fa-bed"></i> {property.bedrooms} bd</li>
                    <li className="list-inline-item"><i className="fas fa-bath"></i> {property.bathrooms} ba</li>
                    <li className="list-inline-item"><i className="fas fa-ruler-combined"></i> {property.size} sqft</li>
                  </ul>
                  <Button href={`/property/${property.id}`} variant="primary">
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No properties found</p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ShowProperties;
