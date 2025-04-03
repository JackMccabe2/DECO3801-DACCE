import "../css/landing.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "../components/button";
import Image from "react-bootstrap/Image";
import Logo from "../assets/chg_logo.png";

const Landing = ({ onNavigate }) => {
  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <Row className="justify-content-center align-items-center">
        <Col xs={12} className="justify-content-center align-items-center">
          {/* <h1 className="landing-title">Cool Hack Game</h1> */}
          <Image src={Logo} className="logo" />
        </Col>
        <Row className="w-100 d-flex justify-content-center align-items-center">
          <Col sm={12} md={4} lg={4}>
            <Button
              text="Sign Up"
              colour="yellow"
              onClick={() => onNavigate("signup")}
            />
          </Col>
          <Col sm={12} md={4} lg={4}>
            <Button
              text="Login"
              colour="yellow"
              onClick={() => onNavigate("login")}
            />
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Landing;
