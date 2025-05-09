import { useState, useEffect } from "react";
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
import { PiSmileyFill } from "react-icons/pi";
import { PiSmileySadFill } from "react-icons/pi";
import { MdError } from "react-icons/md";

import btnClickSound from "../assets/music/button_click_2_pop.mp3";

import PolicyModal from "../components/policymodal";

const Signup = ({ onNavigate }) => {
  const { setUser } = useUser();
  const [tempUsername, setTempUsername] = useState("");
  const [pressed, setPressed] = useState("");
  const { sendMessage, handleRequest } = useWebSocket();
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  useEffect(() => {
    setPressed(false);
  }, []);

  // create function to check if username is available
  const checkDup = async (page) => {
    setShowPolicyModal(false);

    const loginPayload = { type: "POST DUP", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (tempUsername === null || tempUsername === ""){  // check if username is empty to avoid wrong error message
        setToastMessage("Please enter your username and password.");
        setToastType("error");
        setShowToast(true);
        return;
      }
      if (response.status === "OK") {
        setShowPolicyModal(true);
      } else if (response.status === "ERR USER EXISTS") {
        setToastMessage("Username already exists.");
        setToastType("error");
        setShowToast(true);
        return;
      }
    });
  };

  const showPolicy = (page) => {
    <PolicyModal show={true} />;
    handleRequest(
      page,
      { type: "OK", message: page },
      onNavigate(page), // success callback
      (errMsg) => alert("Navigation failed:", errMsg) // failure callback
    );
  };

  // Handle the two redirection buttons below (return to landing & navigate to login).
  const handleClick = (page) => {
    const navPayload = { type: "NAV", message: page };

    sendMessage(navPayload, (response) => {
      if (response.status === "OK") {
        onNavigate(page);
      } else {
        alert("Navigation failed.");
      }
    });
  };

  // Handle the signup create button
  const handleSignup = async (page) => {
    setShowPolicyModal(false);

    if (tempUsername === "") {
      setToastMessage("Please enter a username and password.");
      setToastType("blank");
      setShowToast(true);
      resolve(false);
      return;
    }

    const loginPayload = { type: "POST", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER CREATED") {
        setToastMessage("Welcome to Cool Hack Game, " + tempUsername + "!");
        setToastType("success");
        setShowToast(true);

        setPressed(true);
        setTimeout(() => {
          setUser(response.user);
          onNavigate(page);
        }, 3000);
      } else if (response.status === "ERR USER EXISTS") {
        setToastMessage("Username already exists.");
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
      <Row className="custom-content-wrap p-5 rounded h-100">
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
              required
              placeholder="e.g. Alex #3312"
              className="custom-input-field"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !pressed) {
                  const audio = new Audio(btnClickSound);
                  audio.play();
                  setPressed(true);
                  const success = await checkDup("dashboard");
                  if (!success) {
                    setPressed(false);
                  }
                }
              }}
            />
            <Form.Label className="custom-label text-start w-100 mt-3">
              Create a password
            </Form.Label>
            <Form.Control
              type="password"
              required
              className="custom-input-field"
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
            onClick={async () => {
              if (!pressed) {
                setPressed(true);
                const success = await checkDup("dashboard");
                if (!success) {
                  setPressed(false);
                }
              }
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
              {toastType === "blank" && (
                <MdError
                  style={{
                    marginRight: "0.5rem",
                    fontSize: "1.5rem",
                    color: "var(--dark-red)",
                  }}
                />
              )}
              {toastType === "error" && (
                <PiSmileySadFill
                  style={{
                    marginRight: "0.5rem",
                    fontSize: "1.5rem",
                    color: "var(--dark-red)",
                  }}
                />
              )}
              {toastType === "success" && (
                <PiSmileyFill
                  style={{
                    marginRight: "0.5rem",
                    fontSize: "1.5rem",
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
