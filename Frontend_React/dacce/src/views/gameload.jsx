// Import React Hooks
import { useState, useEffect } from "react";

// Import Bootstrap Components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import Custom Components & Assets & CSS
import ProfilePhoto from "../assets/profile.png";
import "../css/gameload.css";

const GameLoad = ({ onNavigate }) => {
  const [timer, setTimer] = useState(0);
  const [dots, setDots] = useState("");
  const maxTime = 10;

  // Timer for the game loading bar (currently kinda hardcoded to 10 seconds to simulate loading.)
  // But am guessing this part should reflect how our game actually loads?
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= maxTime - 1) {
          clearInterval(interval);
          onNavigate("game");
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [onNavigate]);

  const barWidth = timer >= maxTime ? 100 : (timer / maxTime) * 100;

  // Dots effect
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <>
      <Container
        fluid
        className="vh-100 d-flex flex-column"
        style={{ color: "var(--white)" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} className="game-load-title text-center mb-3">
            <h1 style={{ fontSize: "3rem" }}>Loading Game {dots}</h1>
          </Col>
        </Row>

        {/* Player */}
        {/* Shared profile photo settings: matching.css & matchfound.css & gameload.css */}
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

        {/* Loading bar */}
        {/* Shared progress bar styling: matchfound.css & gameload.css */}
        <Row className="justify-content-center mt-5 mb-4">
          <Col xs={8}>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: "var(--yellow)",
                }}
              ></div>
              {/* Simulated percentage loading progress using timer */}
              <span className="progress-bar-timer">
                {timer >= maxTime ? 100 : Math.round(barWidth)}%
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GameLoad;
