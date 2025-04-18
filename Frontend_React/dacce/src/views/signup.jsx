import { useState } from "react";
import "../css/login.css";
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

import PolicyModal from "../components/policymodal";

const Signup = ({ onNavigate }) => {
  const { user, setUser } = useUser();
  const [tempUsername, setTempUsername] = useState("");
  const { sendMessage, handleRequest } = useWebSocket();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  const handleClick = (page) => {
    <PolicyModal show={true} />;
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
      setToastMessage("Please enter a valid username.");
      setToastType("error");
      setShowToast(true);
      return;
    }
    setShowPolicyModal(true);
  };

  const handleSignup = async (page) => {
    setShowPolicyModal(false);

    const loginPayload = { type: "POST", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER CREATED") {
        setToastMessage("Welcome to Cool Hack Game, " + tempUsername + "!");
        setToastType("success");
        setShowToast(true);

        setTimeout(() => {
          setUser(response.user);
          onNavigate(page);
        }, 3000);
      } else if (response.status === "ERR USER EXISTS") {
        setToastMessage("A user with this username already exists.");
        setToastType("error");
        setShowToast(true);
        return;
      } else {
        console.error("Signup failed:", response.message);
        setToastMessage("An error occurred. Please try again.");
        setToastType("error");
        setShowToast(true);
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateClick("dashboard");
                }
              }}
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
          className="custom-button d-flex justify-content-center align-self-center mt-3"
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

      {/* Private Policy Modal */}
      {showPolicyModal && (
        <PolicyModal
          show={true}
          onConfirm={() => handleSignup("dashboard")}
          onClose={() => setShowPolicyModal(false)}
        />
      )}

      {/* Popup message with delay and autohide (Style changes depend on condition) */}
      <ToastContainer position="top-center" className="p-4 mt-3">
        <Toast
          className={`custom-toast ${toastType}`}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="custom-toast-body">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {toastType === "error" && (
                <MdError
                  style={{
                    marginRight: "0.5rem",
                    fontSize: "1.2rem",
                    color: "var(--dark-red)",
                  }}
                />
              )}
              {toastType === "success" && (
                <FaCheckCircle
                  style={{
                    marginRight: "0.5rem",
                    fontSize: "1.2rem",
                    color: "var(--dark-green)",
                  }}
                />
              )}
              {toastMessage}
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Signup;
