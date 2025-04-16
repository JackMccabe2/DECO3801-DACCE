// Import CSS
import "../css/informationWindow.css";

// Import Bootstrap components
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

// Import Assets
import CancelBtn from "../assets/cancel.png";

const InformationWindow = ({ onNavigate, title, data }) => {
  return (
    <Container className="custom-leaderboard-container">
      <div className="custom-trapezoid">{title}</div>
      <img
        src={CancelBtn}
        alt="Close Button"
        className="custom-close-btn"
        onClick={() => onNavigate("dashboard")}
      />
      <div className="custom-leaderboard-data-container scrollable-table">
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((entry, index) => (
              <tr key={index}>
                <td>{entry.rank}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default InformationWindow;
