// Import components
import Header from "../components/header";
import Background from "../components/background";
import Button from "../components/button";

// Import CSS
import "../css/playGame.css";

const playGame = () => {
  return (
    <>
      <Background />
      <Row>
        <Col xs={12} md={6} lg={6} className="custom-playmode-container">
          <h5>PvP</h5>
          <Button text="Find Match" color="yellow"></Button>
          <Button text="Invite" color="orange"></Button>
        </Col>
        <Col xs={12} md={6} lg={6} className="custom-playmode-container">
          <h5>PvC</h5>
          <Button text="Single Player" color="yellow"></Button>
          <Button text="Multi Player" color="yellow"></Button>
        </Col>
      </Row>
    </>
  );
};

export default playGame;
