// Import Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Import React components
import { useState } from "react";
import Sidemenu from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

// Import CSS
import "../css/header.css";

// Import assets
import levelBadge from "../assets/level-badge.png";
import starMedal from "../assets/star-medal.png";
import profilePic from "../assets/profile.png";

// Import icons
import { RxHamburgerMenu } from "react-icons/rx";
import { IoPersonCircleOutline } from "react-icons/io5";
import { PiRankingFill } from "react-icons/pi";
import { LuHistory } from "react-icons/lu";
import { IoMdSettings } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { useUser } from "../contexts/UserContext";
import { MdSpaceDashboard } from "react-icons/md";

const Navbar = ({ currentView, onNavigate }) => {
  const [show, setShow] = useState(false);
  const { user, setUser } = useUser();

  // Toggle the sidemenu
  const menuToggle = () => setShow((prevShow) => !prevShow);

  return (
    <Container>
      <Row className="d-flex align-items-center header-wrap">
        <Col xs={1} className="custom-nav-container p-0">
          {!show && (
            <Button
              onClick={menuToggle}
              className="burger-menu-btn d-flex align-items-center"
            >
              <RxHamburgerMenu />
            </Button>
          )}
        </Col>
        <Col xs={2} className="custom-nav-container">
          <div className="custom-nav-item">
            <img src={levelBadge} alt="Level Badge" />
            <span>Level 23</span>
          </div>
        </Col>
        <Col xs={2} className="custom-nav-container">
          <div className="custom-nav-item">
            <img src={starMedal} alt="Star Medal" />
            <span>#19</span>
          </div>
        </Col>
        <Col xs={5}></Col>
        <Col
          xs={2}
          className="custom-nav-container custom-profile d-flex justify-content-end"
        >
          <div className="custom-nav-profile gap-3">
            <img src={profilePic} className="rounded-circle" alt="Profile" />
            <span>{user.username}</span>
          </div>
        </Col>
      </Row>

      {/* Side Menu */}
      <Sidemenu show={show} onHide={() => setShow(false)} placement="start">
        <Sidemenu.Header closeButton>
          <Sidemenu.Title className="mx-5 fs-1 w-100">Menu</Sidemenu.Title>
        </Sidemenu.Header>
        <Sidemenu.Body className="d-flex flex-column justify-content-between h-100">
          {/* Top Section */}
          {/* Render "menu-top" if detected currentview is not dashboard */}
          {currentView !== "dashboard" && (
            <div className="menu-top">
              <div>
                <a
                  className="fs-5 mx-5 menu-item"
                  href="#dashboard"
                  onClick={() => {
                    onNavigate("dashboard");
                    setShow(false);
                  }}
                >
                  <MdSpaceDashboard className="menu-icon" /> &nbsp; Dashboard
                </a>
                <a
                  className="fs-5 mx-5 menu-item"
                  href="#profile"
                  onClick={() => {
                    onNavigate("profile");
                    setShow(false);
                  }}
                >
                  <IoPersonCircleOutline className="menu-icon" /> &nbsp; Profile
                </a>
                <a
                  className="fs-5 mx-5 menu-item"
                  href="#leaderboard"
                  onClick={() => {
                    onNavigate("leaderboard");
                    setShow(false);
                  }}
                >
                  <PiRankingFill className="menu-icon" /> &nbsp; Leaderboard
                </a>
                <a
                  className="fs-5 mx-5 menu-item"
                  href="#history"
                  onClick={() => {
                    onNavigate("history");
                    setShow(false);
                  }}
                >
                  <LuHistory className="menu-icon" /> &nbsp; History
                </a>
              </div>
            </div>
          )}

          {/* Bottom Section */}
          <div className="menu-bottom">
            <a className="fs-5 mx-5 menu-item" href="#settings">
              <IoMdSettings className="menu-icon" /> &nbsp; Settings
            </a>
            <a
              className="fs-5 mx-5 menu-item"
              href="#logout"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  onNavigate("landing");
                  window.location.reload();
                }
              }}
            >
              <TbLogout className="menu-icon" /> &nbsp; Log Out
            </a>
          </div>
        </Sidemenu.Body>
      </Sidemenu>
    </Container>
  );
};

export default Navbar;
