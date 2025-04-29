// Import components
import Button from "../components/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Header from "../components/header";

// Import CSS
import "../css/playGame.css";

// Import Context variables
import { useWebSocket } from "../contexts/WebSocketContext";
import { useUser } from "../contexts/UserContext";

const playGame = ({ onNavigate }) => {
  
  const { user } = useUser();
  const { sendMessage } = useWebSocket();


  const initGame = (gamemode, page) => {
    const loginPayload = { type: "INIT GAME", 
      gamemode: gamemode,
      user: user
     };

    sendMessage(loginPayload, (response) => {
      if (response.status === "OK") {
        onNavigate(page);
      } else {
        alert("Unable to initialise game.");
        return;
      }
    });
  };

  return (
    <>
      <div className="dashboard-wrap w-100">
        {/* Update: Moved the header to conditional in App.jsx */}
        {/* <Header /> */}
        <Container className="mt-5">
          <Row className="d-flex justify-content-center gap-5">
            <Col sm={12} md={5} lg={5} className="custom-playmode-container">
              <h4 className="custom-title">PvP</h4>
              <Button
                text="Find Match"
                colour="yellow"
                onClick={() => initGame("M","matching")}
              ></Button>
              <Col sm={12} md={2} lg={2}></Col>
              <Button text="Invite" colour="orange"></Button>
            </Col>
            <Col sm={12} md={5} lg={5} className="custom-playmode-container">
              <h4 className="custom-title">PvC</h4>
              <Button
                text="Single Player"
                colour="yellow"
                onClick={() => initGame("S","game")}
              ></Button>
              <Button
                text="Multi Player"
                colour="yellow"
                onClick={() => initGame("M","matching")}
              ></Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default playGame;
