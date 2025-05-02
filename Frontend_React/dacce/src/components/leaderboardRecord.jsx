// Import Bootstrap components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Import CSS
import "../css/leaderboard.css";

const LeaderboardRecord = ({ data, onDelete }) => {
  const rowClass =
    data.rank === 1
      ? "custom-leaderboard-record first-place"
      : data.rank === 2
      ? "custom-leaderboard-record second-place"
      : data.rank === 3
      ? "custom-leaderboard-record third-place"
      : "custom-leaderboard-record";

  return (
    <Row className={`${rowClass} m-0 mb-4 mx-4`}>
      <Col xs={2} md={2} lg={2}>{data.rank}</Col>
      <Col xs={4} md={4} lg={2}>{data.name}</Col>
      <Col xs={3} md={3} lg={2}>{data.score}</Col>
      <Col xs={3} md={3} lg={2}>{data.winRate}</Col>
      <Col xs={12} md={12} lg={4} className="d-flex justify-content-end gap-2">
        <button className="btn btn-danger" onClick={onDelete}>Delete</button>
      </Col>
    </Row>
  );
};


export default LeaderboardRecord;
