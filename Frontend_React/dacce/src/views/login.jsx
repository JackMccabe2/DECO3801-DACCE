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
import { useState, useEffect } from "react";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { PiSmileyFill } from "react-icons/pi";
import { PiSmileySadFill } from "react-icons/pi";
import { MdError } from "react-icons/md";

const Login = ({ onNavigate }) => {
  const { setUser } = useUser();
  const [tempUsername, setTempUsername] = useState("");
  const [pressed, setPressed] = useState("");
  const { sendMessage } = useWebSocket();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  useEffect(() => {
    setPressed(false);
  }, []);

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
      setToastMessage("Please enter a valid username.");
      setToastType("blank");
      setShowToast(true);
      return;
    }

    const loginPayload = { type: "GET USER", username: tempUsername };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER LOGIN") {
        setToastMessage(
          "Welcome back, " + tempUsername + "! " + "Redirecting..."
        );
        setToastType("success");
        setShowToast(true);

        setTimeout(() => {
          setUser(response.user);
          onNavigate(page);
        }, 2000);
      } else if (response.status === "ERR USER NOT EXIST") {
        setToastMessage("There is no user with this username.");
        setToastType("error");
        setShowToast(true);
        return;
      } else if (response.status === "USER ACTIVE") {
        setToastMessage("User is already logged in.");
        setToastType("error");
        setShowToast(true);
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
      // className="d-flex justify-content-center align-items-center" 
      className={`d-flex justify-content-center align-items-center ${
        toastType === "success" ? "loading-cursor" : ""
      }`}
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
              // onKeyDown={(e) => {
              //   if (e.key === "Enter" && pressed == false) {
              //     setPressed(true);
              //     handleLogin("dashboard");
              //   }
              // }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pressed === false && toastType !== "success") {
                  setPressed(true);
                  handleLogin("dashboard").finally(() => {
                    setPressed(false);
                  });
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
            text="Enter"
            colour="yellow"
            // onClick={() => handleLogin("dashboard")}
            onClick={() => {
              if (toastType !== "success") {
                handleLogin("dashboard");
              }
            }}
            disabled={toastType === "success"} 
            className={toastType === "success" ? "disabled-button" : ""}
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

export default Login;
