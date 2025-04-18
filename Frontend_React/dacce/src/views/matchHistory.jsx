// Import Bootstrap components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Import Components
import MatchHistoryRecord from "../components/matchHistoryRecord";

// Import CSS
import "../css/history.css";

// Import Assets
import CancelBtn from "../assets/cancel.png";

const MatchHistory = ({ onNavigate }) => {
  // Just for testing, can be replace with real data from the database
  // Contains match result (win/Defeat), opponent’s username, both players’ leaderboard scores at the time, and how many puzzles were solved (solved/total).
  // Not sure which table this is based on, feel free to tweak any fields if needed. :)
  const matchHistoryData = [
    {
      opponent: "Player2",
      result: "Win",
      leaderboardPoints: "2000 vs 1850",
      puzzleResult: "3/4",
      date: "2025-04-01",
    },
    {
      opponent: "Player4",
      result: "Defeat",
      leaderboardPoints: "1900 vs 2100",
      puzzleResult: "2/4",
      date: "2025-04-02",
    },
    {
      opponent: "Player6",
      result: "Win",
      leaderboardPoints: "2200 vs 2000",
      puzzleResult: "4/4",
      date: "2025-04-03",
    },
    {
      opponent: "Player8",
      result: "Defeat",
      leaderboardPoints: "1800 vs 1900",
      puzzleResult: "1/4",
      date: "2025-04-04",
    },
    {
      opponent: "Player10",
      result: "Win",
      leaderboardPoints: "2100 vs 2000",
      puzzleResult: "3/4",
      date: "2025-04-05",
    },
  ];
  return (
    <>
      <Container className="custom-matchhistory-container">
        <div className="custom-trapezoid text-center">Match History</div>

        <img
          src={CancelBtn}
          alt="Close"
          className="custom-close-btn"
          onClick={() => onNavigate("dashboard")}
        />

        <Container fluid className="custom-matchhistory-data-container p-0">
          <Row className="custom-matchhistory-title m-0 mx-5 pe-3 mb-3">
            <Col xs={2} md={2} lg={2}>
              Result
            </Col>
            <Col xs={4} md={4} lg={3}>
              Opponent
            </Col>
            <Col xs={3} md={3} lg={4}>
              Leaderboard Score
            </Col>
            <Col xs={3} md={3} lg={3}>
              Puzzle Result
            </Col>
          </Row>
          <Container
            fluid
            className="custom-matchhistory-record-container m-0 mt-4"
          >
            {matchHistoryData?.map((record, index) => (
              <MatchHistoryRecord data={record} key={index} />
            ))}
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default MatchHistory;