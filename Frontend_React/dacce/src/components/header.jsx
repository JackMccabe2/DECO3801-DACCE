// Import Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Import CSS
import "../css/header.css";

// Import components
import levelBadge from "../assets/level-badge.png";
import starMedal from "../assets/star-medal.png";
import profilePic from "../assets/profile.png";

const Navbar = () => {
  return (
    <Row className="w-100 d-flex align-items-center">
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
      <Col xs={6}></Col>
      <Col
        xs={2}
        className="custom-nav-item-container custom-profile d-flex justify-content-end"
      >
        <div className="custom-nav-profile gap-3">
          <img src={profilePic} className="rounded-circle" alt="Profile" />
          <span>Alex</span>
        </div>
      </Col>
    </Row>
  );
};

export default Navbar;
