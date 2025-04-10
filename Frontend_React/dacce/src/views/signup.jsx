import { useState } from "react";
import "../css/login.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useWebSocket } from "../contexts/WebSocketContext";
import { FaLongArrowAltLeft } from "react-icons/fa";

const Signup = ({ onNavigate }) => {
  const [username, setUsername] = useState("");
  const { sendMessage, handleRequest } = useWebSocket();

  const handleClick = (page) => {
    handleRequest(
      page,
      { type: "NAV", message: page },
      onNavigate, // success callback
      (errMsg) => alert("Navigation failed:", errMsg) // failure callback
    );
  };

  const handleSignup = async ( page ) => {
    
    if (username  === "") {
      alert("Username blank");
      return;
    }

    const loginPayload = { type: "POST", username: username };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK") {
        //alert("user created: " + username + "!");
        onNavigate(page)
      } else {
        console.error("Login failed:", response.message);
      }
    });
  }
    
  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row className="custom-content-wrap p-4 rounded">
        <Col xs={12}>
          <h1 className="text-center mb-4 mt-4">SIGN UP</h1>
        </Col>
        <Col xs={12}>
          <Form.Group>
            <Form.Label className="custom-label text-start w-100">
              Create a username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Alex #3312"
              className="custom-input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center"
        >
          <Button text="Create" colour="yellow" onClick={() => {
              handleSignup("dashboard")
            }}
            />
  
        </Col>
        <Col
          xs={12}
          className="custom-button d-flex justify-content-center align-self-center"
        >
          <div>
            <span
              className="return-btn"
              style={{ color: "black", cursor: "pointer" }}
              onClick={() => handleClick("login")}
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
              onClick={() => {
                handleClick("landing")
              }
            }
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
