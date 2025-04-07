import "../css/login.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import { useWebSocket } from "../utils/socketContext";

import { FaLongArrowAltLeft } from "react-icons/fa";

const Signup = ({ onNavigate }) => {
  const [username, setUsername] = useState("");
  const socket = useWebSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("username: ", username);
    if (socket) {
      const payload = {
        method: "createPlayer", // The method we will handle in the server
        params: {
          username: username,
          firewall_skill: 1,
          encipher_skill: 1,
          leaderboard_score: 0,
        },
      };
      console.log("sending player");
      // Send the message to the server
      socket.send(JSON.stringify(payload));
    } else if (!socket) {
      console.error("WebSocket is not connected!");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row className="custom-content-wrap p-4 rounded">
        <Col xs={12}>
          <h1 className="text-center mb-4 mt-4">SIGN UP</h1>
        </Col>
        <Col xs={12} className="">
          <Form.Group>
            <Form.Label className="custom-label text-start w-100">
              Create a username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Alex #3312"
              className="custom-input-field"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center"
        >
          <Button text="Create" colour="yellow" onClick={handleSubmit}/>
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center"
        >
          <div>
            <span
              className="return-btn"
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => onNavigate("login")}
            >
              Already have an account? LOGIN
            </span>
            <br />
            <span
              className="return-btn"
              style={{
                textDecoration: "none",
                color: "black",
                cursor: "pointer",
              }}
              onClick={() => onNavigate("landing")}
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

export default Signup;
