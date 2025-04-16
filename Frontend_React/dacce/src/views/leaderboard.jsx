

// Import Components
import InformationWindow from "../components/informationWindow";

// Import CSS
import "../css/leaderboard.css";

// Import contexts
import { useState, useEffect } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const Leaderboard = ({ onNavigate }) => {

  const [leaderboardData, setLeaderboardData] = useState([]);
  const { sendMessage } = useWebSocket();

  useEffect(() => {

    const loginPayload = { type: "GET LEADERBOARD", message: "payload to get leaderboard" };
    sendMessage(loginPayload, (response) => {
      if (response.status === "SUCCESS") {
        setLeaderboardData(response.data);
        console.log("set answer to: " + response.data.answer)
      } else if (response.status === "EMPTY") {
        //const leaderboardData = "Unable to retrieve leaderboard results."
        setLeaderboardData("leadernoard empty");
      } else {
        setLeaderboardData("error retrieving leaderboard");
      }
    });
  }, []);

  

  /*
  const leaderboardData = [
    { rank: 1, name: "Alice", score: 1200 },
    { rank: 2, name: "Bob", score: 1150 },
    { rank: 3, name: "Charlie", score: 1100 },
    { rank: 4, name: "Dave", score: 1080 },
    { rank: 5, name: "Eve", score: 1060 },
    { rank: 6, name: "Alice", score: 1200 },
    { rank: 7, name: "Bob", score: 1150 },
    { rank: 8, name: "Charlie", score: 1100 },
    { rank: 9, name: "Dave", score: 1080 },
    { rank: 10, name: "Eve", score: 1060 },
    { rank: 1, name: "Alice", score: 1200 },
    { rank: 2, name: "Bob", score: 1150 },
    { rank: 3, name: "Charlie", score: 1100 },
    { rank: 4, name: "Dave", score: 1080 },
    { rank: 5, name: "Eve", score: 1060 },
    // Add more entries if needed
  ];*/

  return (
    <>
      <InformationWindow title="Leaderboard" onNavigate={onNavigate} data={leaderboardData}/>
    </>
  );
};

export default Leaderboard;
