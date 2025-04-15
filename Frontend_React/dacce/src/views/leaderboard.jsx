

// Import Components
import InformationWindow from "../components/informationWindow";

// Import CSS
import "../css/leaderboard.css";

const Leaderboard = ({ onNavigate }) => {

  return (
    <>
      <InformationWindow title="Leaderboard" onNavigate={onNavigate}/>
    </>
  );
};

export default Leaderboard;
