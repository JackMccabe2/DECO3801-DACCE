// Import Bootstrap components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import Components
import LeaderboardRecord from "../components/leaderboardRecord";

// Import CSS
import "../css/leaderboard.css";

// Import Assets
import CancelBtn from "../assets/cancel.png";

// Import contexts
import { useState, useEffect } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const Leaderboard = ({ onNavigate }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { sendMessage } = useWebSocket();

  useEffect(() => {
    const loginPayload = {
      type: "GET LEADERBOARD",
      message: "payload to get leaderboard",
    };
    sendMessage(loginPayload, (response) => {
      if (response.status === "SUCCESS") {
        setLeaderboardData(response.data);
        console.log("set answer to: " + response.data.answer);
      } else if (response.status === "EMPTY") {
        //const leaderboardData = "Unable to retrieve leaderboard results."
        setLeaderboardData("leadernoard empty");
      } else {
        setLeaderboardData("error retrieving leaderboard");
      }
    });
  }, []);

  return (
    <>
      <Container className="custom-leaderboard-container">
        <div className="custom-trapezoid text-center">Leaderboard</div>

        <img
          src={CancelBtn}
          alt="Close"
          className="custom-close-btn"
          onClick={() => onNavigate("dashboard")}
        />

        <Container fluid className="custom-leaderboard-data-container p-0">
          <Row className="custom-leaderboard-title m-0 mx-5 pe-3 mb-3">
            <Col xs={2} md={2} lg={2}>
              Ranking
            </Col>
            <Col xs={4} md={4} lg={2}>
              Player
            </Col>
            <Col xs={3} md={3} lg={4}>
              Score
            </Col>
            <Col xs={3} md={3} lg={4}>
              Win Rate
            </Col>
          </Row>
          <Container
            fluid
            className="custom-leaderboard-record-container m-0 mt-4"
          >
            {leaderboardData?.map((record, index) => (
              <LeaderboardRecord data={record} key={index} />
            ))}
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default Leaderboard;
