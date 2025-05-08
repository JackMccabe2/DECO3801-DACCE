import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import Matched from "./matchfound";

import ProfilePhoto from "../assets/profile.png";

import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";

import "../css/matching.css";

const Matching = ({ onNavigate }) => {
  const [timer, setTimer] = useState(0);
  const [dots, setDots] = useState("");
  const { sendMessage } = useWebSocket();
  const { user } = useUser();

  const exitGame = (user) => {
    const loginPayload = { type: "EXIT GAME", message: user };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK") {
        return;
      } else {
        alert("Leaving game failed.");
        return;
      }
    });
  };

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Dots effect
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // Hard coded a timer here to simulate the matching process.
  // To-do: Replace this with our server response (& player data)?
  if (timer >= 5) {
    return <Matched onNavigate={onNavigate} />;
  }

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column"
      style={{ color: "var(--white)" }}
    >
      {/* Timer */}
      <Row className="justify-content-center">
        <Col
          xs={12}
          className="text-center align-items-center justify-content-center mt-5"
        >
          <div className="custom-timer">
            <h1>{formatTime(timer)}</h1>
          </div>
        </Col>
        <Col xs={12} className="custom-matching-title text-center mb-1">
          <h1>Matching Player{dots}</h1>
        </Col>
      </Row>

      {/* Profile */}
      {/* Shared profile photo settings: matching.css & matchfound.css & gameload.css */}
      <Row className="custom-profile-row d-flex align-items-center justify-content-center">
        <Col xs={4} className="d-flex justify-content-end">
          <img
            src={ProfilePhoto}
            alt="User 1"
            className="rounded-circle profile-photo"
          />
        </Col>
        <Col xs={3} className="d-flex justify-content-center">
          <h1>VS</h1>
        </Col>
        <Col xs={4} className="d-flex justify-content-start">
          <img
            src={ProfilePhoto}
            alt="User 2"
            className="rounded-circle profile-photo"
          />
        </Col>
      </Row>

      {/* Cancel */}
      <Row className="justify-content-center mb-3">
        <Col xs={12} className="text-center">
          <Button
            variant="link"
            className="custom-cancel-btn"
            style={{
              color: "var(--white)",
              letterSpacing: "0.1em",
              fontSize: "1.5em",
            }}
            onClick={() => {
              exitGame(user);
              onNavigate("playgame");
            }}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Matching;
