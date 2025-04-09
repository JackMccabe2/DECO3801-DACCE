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
  const { isConnected, sendMessage } = useWebSocket();
  ///// cfretes vairale status that can access in whole program that reflects wether the server response is valid

  const handleClick = async ( page ) => {
    
    if (isConnected) {
      const loginPayload = { type: "login", username: "myUser" };

      sendMessage(loginPayload, (response) => {
        if (response.status === "OK") {
          onNavigate(page);
        } else {
          console.error("Login failed:", response.message);
        }
      }
    )
    } else {
      console.log("WebSocket not connected.");
      return false;
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
                handleClick("signup");
                }
              }
            />
          </Col>
          <Col sm={12} md={4} lg={4}>
            <Button
              text="Login"
              colour="yellow"
              onClick={() => {
                handleClick("login");
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
