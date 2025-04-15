import "../css/login.css";

import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";

import { FaLongArrowAltLeft } from "react-icons/fa";

const Login = ({ onNavigate }) => {
  const { setUser } = useUser();
  const [tempUsername, setTempUsername] = useState("");
  const { sendMessage } = useWebSocket();

  const handleClick = (page) => {
    const loginPayload = { type: "NAV", message: page };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK") {
        onNavigate(page);
      } else {
        alert("Navigation failed.");
        return;
      }
    });
  };

  const handleLogin = async (page) => {
    if (tempUsername === "") {
      alert("Username blank");
      return;
    }

    const loginPayload = { type: "GET USER", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER LOGIN") {
        alert("Welcome back, " + tempUsername + "!");
        setUser(response.user);
        onNavigate(page);
      } else if (response.status === "ERR USER NOT EXIST") {
        alert("There is no user with this username.");
        return;
      } else {
        console.error("Login failed:", response.message);
        return;
      }
    });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Row className="custom-content-wrap p-5 rounded">
        <Col xs={12}>
          <h1 className="text-center mb-4 mt-4">LOG IN</h1>
        </Col>
        <Col xs={12}>
          <Form.Group>
            <Form.Label className="custom-label text-start w-100">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              className="custom-input-field"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center"
        >
          <Button
            text="Enter"
            colour="yellow"
            onClick={() => handleLogin("dashboard")}
          />
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center mt-3"
        >
          <div>
            <span
              className="return-btn"
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => handleClick("signup")}
            >
              No account yet? SIGNUP
            </span>
            <br />
            <span
              className="return-btn"
              style={{
                textDecoration: "none",
                color: "black",
                cursor: "pointer",
              }}
              onClick={() => handleClick("landing")}
            >
              <FaLongArrowAltLeft /> {""}
              Return
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
