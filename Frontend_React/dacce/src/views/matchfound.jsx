import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Button from "../components/button";
import ProfilePhoto from "../assets/profile.png";

import "../css/matchfound.css";

const Matched = ({ onNavigate }) => {
  const [timer, setTimer] = useState(30);
  const maxTime = 30;

  // Countdown timer, resets the page to "playgame/matching" when the timer reaches 0
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          // TBD: Can either reset to playgame or matching page?
          onNavigate("playgame");
        }
        return prev - 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [onNavigate]);

  // Progress bar width (yellow bar) changes according to the timer
  const progressWidth = (timer / maxTime) * 100;

  return (
    <>
      <Container
        fluid
        className="vh-100 d-flex flex-column"
        style={{ color: "var(--white)" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} className="match-found-title text-center mb-3">
            <h1 style={{ fontSize: "3rem" }}>
              Player found. Click accept to start game !
            </h1>
          </Col>
        </Row>

        {/* Progress bar & Timer */}
        <Row className="justify-content-center mb-4">
          <Col xs={4}>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${progressWidth}%`,
                  backgroundColor: "var(--yellow)",
                }}
              ></div>
              <span className="progress-bar-timer">{timer} seconds</span>
            </div>
          </Col>
        </Row>

        {/* Player */}
        <Row className="custom-profile-row d-flex align-items-center justify-content-center mb-2 mt-4">
          <Col xs={4} className="d-flex justify-content-end">
            <div className="player-profile">
              <img
                src={ProfilePhoto}
                alt="User 1"
                className="rounded-circle profile-photo"
              />
              <h3 className="player-name">Player 1</h3>
              <h5 className="player-lvl">Level 23</h5>
            </div>
          </Col>
          <Col xs={3} className="d-flex justify-content-center">
            <h1>VS</h1>
          </Col>
          <Col xs={4} className="d-flex justify-content-start">
            <div className="player-profile">
              <img
                src={ProfilePhoto}
                alt="User 2"
                className="rounded-circle profile-photo"
              />
              <h3 className="player-name">Player 2</h3>
              <h5 className="player-lvl">Level 20</h5>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mb-3">
          <Col xs={4} className="text-center">
            <Button
              text="Deny"
              background="var(--red)"
              btnHover="deny-btn-hover"
              onClick={() => onNavigate("playgame")}
            ></Button>
          </Col>
          <Col xs={4} className="text-center">
            <Button
              text="Accept"
              colour="yellow"
              onClick={() => onNavigate("game")}
            ></Button>
          </Col>
        </Row>
      </Container>

      <></>
    </>
  );
};

export default Matched;
