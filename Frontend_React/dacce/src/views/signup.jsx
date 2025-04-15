import { useState } from "react";
import "../css/login.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";

import { FaLongArrowAltLeft } from "react-icons/fa";
import PolicyModal from "../components/policymodal";

const Signup = ({ onNavigate }) => {
  const { user, setUser } = useUser();
  const [tempUsername, setTempUsername] = useState("");
  const { sendMessage, handleRequest } = useWebSocket();
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const handleClick = (page) => {
    handleRequest(
      page,
      { type: "NAV", message: page },
      onNavigate(page), // success callback
      (errMsg) => alert("Navigation failed:", errMsg) // failure callback
    );
  };

  // Show the private policy modal when the "Create" button is clicked.
  const handleCreateClick = () => {
    if (tempUsername === "") {
      alert("Please enter a valid username.");
      return;
    }
    setShowPolicyModal(true);
  };

  const handleSignup = async (page) => {
    // if (tempUsername === "") {
    //   alert("Username blank");
    //   return;
    // }

    setShowPolicyModal(false);

    const loginPayload = { type: "POST", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER CREATED") {
        alert("User created: " + tempUsername + "!");
        setUser(response.user);
        onNavigate(page);
      } else if (response.status === "ERR USER EXISTS") {
        alert("A user with this username already exists.");
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
            text="Create"
            colour="yellow"
            onClick={() => {
              handleCreateClick("dashboard");
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
                handleClick("landing");
              }}
            >
              <FaLongArrowAltLeft /> {""}
              Return
            </span>
          </div>
        </Col>
      </Row>

      {showPolicyModal && (
        <PolicyModal
          show={true}
          onConfirm={() => handleSignup("dashboard")}
          onClose={() => setShowPolicyModal(false)}
        />
      )}
    </Container>
  );
};

export default Signup;
