// Import components
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import CSS
import "../css/playGame.css";

const playGame = () => {
  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={5} lg={5} className="custom-playmode-container">
            <div>
              <h4 className="custom-title">PvP</h4>
            </div>
            <div>
              <Button text="Find Match" colour="yellow"></Button>
            </div>
          <Col sm={12} md={2} lg={2}></Col>
            <div>
              <Button text="Invite" colour="orange"></Button>
            </div>
          </Col>
          <Col sm={12} md={5} lg={5} className="custom-playmode-container">
            <h4 className="custom-title">PvC</h4>
            <Button text="Single Player" colour="yellow"></Button>
            <Button text="Multi Player" colour="yellow"></Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default playGame;
