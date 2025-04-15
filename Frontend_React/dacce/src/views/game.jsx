// Import React component
import React, { useEffect, useState } from "react";

// Import Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

// Import CSS
import "../css/game.css";

// Import components
import AppWindow from "../components/appWindow";
import Terminal from "../components/terminal";

const Game = ({ onNavigate }) => {

  // Timer
  const [timeLeft, setTimeLeft] = useState(60); // second

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Container fluid className="game-wrapper">
        <Row xs="auto" className="d-flex align-items-start justify-content-start">
          <Col>
            <div className="custom-state-container px-4 py-3 d-flex align-items-center">
              <span className="custom-timer-text">Stage 2</span>
            </div>
          </Col>
          <Col>
            <div className="custom-state-container px-4 py-3 d-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-stopwatch me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
              </svg>
              <span className="custom-timer-text">{formatTime(timeLeft)}</span>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Puzzle */}
      <AppWindow
        positionx="750"
        positiony="50"
        width="500"
        height="200"
        padding="3"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-exclamation-triangle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
        }
        title="Encrypted Message..."
        content="One of the criminals, known as “The Archivist”, always hides messages in old formats so that only those who know the history of encoding can understand them..."
      />

      {/* Terminal */}
      <AppWindow
        positionx="600"
        positiony="300"
        width="600"
        height="fit-content"
        padding="0"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-terminal-fill"
            viewBox="0 0 16 16"
          >
            <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5z" />
          </svg>
        }
        title="Terminal"
        content={<Terminal id="terminal" />}
      />
    </>
  );
};

export default Game;