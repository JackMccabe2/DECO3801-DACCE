// landing.jsx

import { useState } from "react";
import "../css/landing.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "../components/button";
import Image from "react-bootstrap/Image";
import Logo from "../assets/chg_logo.png";
import { useWebSocket } from "../contexts/WebSocketContext";

const Landing = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const { isConnected, sendMessage } = useWebSocket();

  const handleInitializePlayer = () => {
    if (username.trim() && isConnected) {
      console.log("Sending username to server:", username); // ✅ Confirm trigger
      sendMessage(JSON.stringify({ method: "init", username }));

    } else {
      console.log("WebSocket not connected or username empty.");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="justify-content-center align-items-center">
          <Image src={Logo} className="logo" />
        </Col>
        <Row className="w-100 d-flex justify-content-center align-items-center">
          <Col sm={12} md={4} lg={4}>
            <Button
              text="Sign Up"
              colour="yellow"
              onClick={() => {
                handleInitializePlayer();
                onNavigate("signup")}
              }
            />
          </Col>
          <Col sm={12} md={4} lg={4}>
            <Button
              text="Login"
              colour="yellow"
              onClick={() => {
                handleInitializePlayer();
                onNavigate("login");
              }}
              disabled={!isConnected}
            />
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Landing;
