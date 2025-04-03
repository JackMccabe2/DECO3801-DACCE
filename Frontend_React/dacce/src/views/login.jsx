import "../css/login.css";

import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import { FaLongArrowAltLeft } from "react-icons/fa";

const Signup = ({ onNavigate }) => {
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
            onClick={() => onNavigate("dashboard")}
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
              onClick={() => onNavigate("signup")}
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
