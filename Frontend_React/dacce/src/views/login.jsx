import "../css/login.css";

import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";
import { FaLongArrowAltLeft } from "react-icons/fa";

const Login = ({ onNavigate }) => {
  
  const { username, setUsername } = useUser();
  const { sendMessage, handleRequest } = useWebSocket();
  
  const handleClick = (page) => {
    handleRequest(
      page,
      { type: "NAV", message: page },
      onNavigate, // success callback
      (errMsg) => alert("Navigation failed:", errMsg) // failure callback
    );
  };

  const handleLogin = async ( page ) => {
    
    if (username  === "") {
      alert("Username blank");
      return;
    }

    const loginPayload = { type: "GET", username: username };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK USER LOGIN") {
        alert("user logged in: " + username + "!");
        setUsername(username)
        onNavigate(page)
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
      className="vh-100 d-flex justify-content-center align-items-center"
    >
      <Row className="custom-content-wrap p-4 rounded">
        <Col xs={12}>
          <h1 className="text-center mb-4 mt-4">LOGIN</h1>
        </Col>
        <Col xs={12} className="">
          <Form.Group>
            <Form.Label className="custom-label text-start w-100">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
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
          <Button
            text="Enter"
            colour="yellow"
            onClick={() => handleLogin("dashboard")}
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
