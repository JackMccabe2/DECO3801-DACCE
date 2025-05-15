// Import React Hooks
import { useState, useEffect } from "react";

// Import Bootstrap Components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import Custom Components & Assets & CSS
import Button from "../components/button";
import ProfilePhoto from "../assets/profile.png";
import GameLoad from "./gameload";

import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";

import "../css/matchfound.css";

const Matched = ({ onNavigate }) => {
  const [timer, setTimer] = useState(30);
  const [opponent, setOpponent] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [userScore, setUserScore] = useState("");
  const { sendMessage, setGameState, gameState } = useWebSocket();
  const { user } = useUser();
  const maxTime = 30;

  useEffect(() => {
    const key = Object.keys(gameState)[0];
    if (!key || !gameState[key]) return;
  
    const users = gameState[key].users;
    if (!users) return;

    if (gameState === null || Object.keys(gameState[key].users).length == 1)  {
      console.log("Game State: " + gameState);
      alert("opponent left");
      onNavigate("playgame");
    }

  }, [gameState]); 

  // Countdown timer, resets the page to "playgame/matching" when the timer reaches 0
  useEffect(() => {
    const gameId = Object.keys(gameState)[0];
    const users = gameState[gameId].users;
  
    let opponentUsername = "";
    for (const username in users) {
      if (username !== user.username) {
        opponentUsername = username;
        break;
      }
    }
  
    setOpponent(opponentUsername);
  
    const userData = gameState[gameId].userdata;
    setUserScore(userData.find(u => u.username === user.username)?.leaderboard_score);
    setOpponentScore(userData.find(u => u.username === opponentUsername)?.leaderboard_score);
  
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigate("playgame");
        }
        return prev - 1;
      });
    }, 1500);
  
    return () => clearInterval(interval);
  }, [onNavigate]);

  async function handleAccept() {
    const payload = { 
      type: "USER READY", 
      message: 
        {
          gameId: Object.keys(gameState)[0], 
          username: user.username
        } 
    };

    await sendMessage(payload, (response) => {
      if (response.status === "OK GOT GAME") {
        //alert("got game");
        onNavigate("gameload");
      } else if (response.status === "ERROR"){
        alert("error occurred in initializing game");
        onNavigate("dashboard");
      } 
      
    });
  }

  async function handleDeny() {
    console.log("Game State: " + gameState);
    const loginPayload = { type: "EXIT GAME", message: user };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK") {
        onNavigate("playgame");
        return;
      } else {
        alert("Leaving game failed.");
        return;
      }
    });
  }

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
        {/* Shared progress bar styling: matchfound.css & gameload.css */}
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
        {/* Shared profile photo settings: matching.css & matchfound.css & gameload.css */}
        <Row className="custom-profile-row d-flex align-items-center justify-content-center mb-2 mt-4">
          <Col xs={4} className="d-flex justify-content-end">
            <div className="player-profile">
              <img
                src={ProfilePhoto}
                alt="User 1"
                className="rounded-circle profile-photo"
              />
              <h3 className="player-name">{user.username}</h3>
              <h5 className="player-lvl">{userScore}</h5>
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
              <h3 className="player-name">{opponent}</h3>
              <h5 className="player-lvl">{opponentScore}</h5>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mb-3">
          <Col xs={4} className="text-center">
            <Button
              text="Deny"
              background="var(--red)"
              btnHover="deny-btn-hover"
              onClick={ async () => await handleDeny() }
            ></Button>
          </Col>
          <Col xs={4} className="text-center">
            <Button
              text="Accept"
              colour="yellow"
              onClick={ async () => await handleAccept() }
            ></Button>
          </Col>
        </Row>
      </Container>

      <></>
    </>
  );
};

export default Matched;
