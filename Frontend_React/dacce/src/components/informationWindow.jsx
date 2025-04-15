// Import CSS
import "../css/informationWindow.css";

// Import Bootstrap components
import Container from "react-bootstrap/Container";

// Import Components
import LeaderboardRecord from "../components/leaderboardRecord";

// Import Assets
import CancelBtn from "../assets/cancel.png";

const InformationWindow = ({ onNavigate, title }) => {
  return (
    <>
      <Container className="custom-leaderboard-container">
        <div className="custom-trapezoid">
          {title}
          
        </div>
        <img
            src={CancelBtn}
            alt="Close Button"
            className="custom-close-btn"
            onClick={() => {
              onNavigate("dashboard");
            }}
          />
        <div className="custom-leaderboard-data-container">
          {/* <LeaderboardRecord onNavigation={onNavigate} /> */}
        </div>
      </Container>
    </>
  );
};

export default InformationWindow;
