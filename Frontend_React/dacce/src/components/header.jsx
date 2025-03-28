import React from "react";

// Import Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Import CSS
import "../css/general.css";

// Import components
import levelBadge from "../assets/level-badge.png";
import starMedal from "../assets/star-medal.png";
import profilePic from "../assets/profile.png";

const Navbar = () => {
  return (
    <nav className="navbar custom-nav-container">
      <Container>
        <Row className="w-100 d-flex align-items-center">
          <Col xs={2}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </Col>
          <Col xs={2} className="custom-nav-item-container">
            <div className="custom-nav-item">
              <img src={levelBadge} alt="Level Badge" />
              <span>Level 23</span>
            </div>
          </Col>
          <Col xs={2} className="custom-nav-item-container">
            <div className="custom-nav-item">
              <img src={starMedal} alt="Star Medal" />
              <span>#19</span>
            </div>
          </Col>
          <Col xs={5}></Col>
          <Col xss={2} className="custom-nav-item-container custom-profile d-flex justify-content-end">
            <div className="custom-nav-item gap-3">
              <img src={profilePic} className="rounded-circle" alt="Profile" />
              <span>Alex</span>
            </div>
          </Col>
        </Row>
      </Container>
    </nav>
  );
};

export default Navbar;