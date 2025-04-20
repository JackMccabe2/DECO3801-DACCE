// Import React component
import React, { useEffect, useState, useRef } from "react";

// Import Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

// Import CSS
import "../css/game.css";

// Import components
import AppWindow from "../components/appWindow";
import Terminal from "../components/terminal";

// Import contexts
import { useWebSocket } from "../contexts/WebSocketContext";

const Game = ({ onNavigate }) => {
  const [puzzle, setPuzzle] = useState("");
  const { sendMessage } = useWebSocket();
  const hasFetchedPuzzle = useRef(false);
  // Timer
  const [timeLeft, setTimeLeft] = useState(60); // second

  useEffect(() => {
    if (hasFetchedPuzzle.current) return; // prevent repeat
    hasFetchedPuzzle.current = true;

    const loginPayload = {
      type: "GET PUZZLE",
      message: "payload to get puzzle",
    };
    sendMessage(loginPayload, (response) => {
      if (response.status === "PUZZLE") {
        setPuzzle(response.data);
        console.log("set answer to: " + response.data.answer);
      } else {
        alert("Get puzzle failed.");
        return;
      }
    });
  }, []);

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

  const handleTerminalCommand = (input) => {
    console.log("User entered:", input);

    if (!puzzle || !puzzle.answer) {
      alert("Puzzle not loaded yet.");
      return;
    }

    if (input === puzzle.answer) {
      alert("Correct answer!");
      // Do something like advance stage or send to server
    } else {
      alert("Incorrect! Try again." + puzzle.answer);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const leaveGame = () => {
    setShowLeaveModal(true);
  };

  return (
    <>
      <Container fluid className="game-wrapper">
        <Row
          xs="auto"
          className="d-flex align-items-start justify-content-start"
        >
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

      {/* Tool Window */}
      <AppWindow
        positionx="250"
        positiony="100"
        width="200"
        height="100"
        padding="3"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-wrench"
            viewBox="0 0 16 16"
          >
            <path d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11z" />
          </svg>
        }
        title="Toolbox"
        content={
          <>
            <Row className="d-flex align-items-center justify-content-center">
              <Col className="d-flex align-items-center justify-content-center">
                <OverlayTrigger
                  key="bottom"
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-bottom">Game Tips</Tooltip>
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-info-circle-fill custom-icon"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                  </svg>
                </OverlayTrigger>
              </Col>
              <Col className="d-flex align-items-center justify-content-center">
                <OverlayTrigger
                  key="bottom"
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-bottom">Leave the game</Tooltip>
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-door-closed-fill custom-icon"
                    viewBox="0 0 16 16"
                    onClick={() => {
                      leaveGame();
                    }}
                  >
                    <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                  </svg>
                </OverlayTrigger>
              </Col>
            </Row>
          </>
        }
      />

      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal show" style={{ display: "block" }}>
            <Modal.Dialog className="modal-dialog-centered">
              <Modal.Header closeButton onHide={() => setShowLeaveModal(false)}>
                <Modal.Title>Leave Game?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Your progress will be recorded as a failure, and you’ll lose
                  100 points on the leaderboard score. Still want to leave?
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onNavigate("dashboard")}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        </div>
      )}

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
        content={puzzle.question}
        //content="One of the criminals, known as “The Archivist”, always hides messages in old formats so that only those who know the history of encoding can understand them..."
      />

      {/* Terminal */}
      {puzzle && (
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
          content={<Terminal onCommand={handleTerminalCommand} />}
        />
      )}
    </>
  );
};

export default Game;
