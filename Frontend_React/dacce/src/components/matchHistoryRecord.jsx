// Import Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Import CSS
import "../css/history.css";

const LeaderboardRecord = ({ data }) => {
  const rowClass =
    data.result === "Win"
      ? "custom-matchhistory-record win"
      : data.result === "Defeat"
      ? "custom-matchhistory-record defeat"
      : "custom-matchhistory-record";
  return (
    <>
      <Row className={`${rowClass} m-0 mb-4 mx-4`}>
        <Col xs={2} md={2} lg={2}>
          {data.result}
        </Col>
        <Col xs={4} md={4} lg={3}>
          {data.opponent}
        </Col>
        <Col xs={3} md={3} lg={4}>
          {data.leaderboardPoints}
        </Col>
        <Col xs={3} md={3} lg={3}>
          {data.puzzleResult}
        </Col>
      </Row>
    </>
  );
};

export default LeaderboardRecord;
