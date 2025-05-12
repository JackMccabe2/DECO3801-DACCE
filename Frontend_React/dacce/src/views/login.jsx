// Import CSS
import "../css/login.css";

// Import Custom Components
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

// Import React Hooks & WebSocket
import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect } from "react";

// Import Icons
import { FaLongArrowAltLeft } from "react-icons/fa";
import { PiSmileyFill } from "react-icons/pi";
import { PiSmileySadFill } from "react-icons/pi";
import { MdError } from "react-icons/md";

// Import Sound
import btnClickSound from "../assets/music/button_click_2_pop.mp3";

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

  // Handle the two redirection buttons below (return to landing & navigate to signup).
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

  // Handle the login enter button
  const handleLogin = async (page) => {
    return new Promise((resolve) => {
      if (tempUsername === "") {
        setToastMessage("Please enter a valid username.");
        setToastType("blank");
        setShowToast(true);
        resolve(false);
        return;
      }

      const loginPayload = { type: "GET USER", username: tempUsername };

      sendMessage(loginPayload, (response) => {
        if (response.status === "OK USER LOGIN") {
          setToastMessage("Welcome back, " + tempUsername + "! Redirecting...");
          setToastType("success");
          setShowToast(true);

          setTimeout(() => {
            setUser(response.user);
            onNavigate(page);
          }, 2000);
          resolve(true);
        } else if (response.status === "ERR USER NOT EXIST") {
          setToastMessage("There is no user with this username.");
          setToastType("error");
          setShowToast(true);
          setPressed(false);
          resolve(false);
        } else if (response.status === "USER ACTIVE") {
          setToastMessage("User is already logged in.");
          setToastType("error");
          setShowToast(true);
          setPressed(false);
          resolve(false);
        } else {
          console.error("Login failed:", response.message);
          resolve(false);
        }
      });
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
      <Row className="custom-content-wrap p-5 rounded h-100">
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
              required
              placeholder="Enter your username"
              className="custom-input-field"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !pressed && toastType !== "success") {
                  const audio = new Audio(btnClickSound);
                  audio.play();
                  setPressed(true);
                  const success = await handleLogin("dashboard").finally(() => {
                    if (!success) {
                      setPressed(false);
                    }
                  });
                }
              }}
            />
            <Form.Label className="custom-label text-start w-100 mt-3">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Enter your password"
              className="custom-input-field"
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
