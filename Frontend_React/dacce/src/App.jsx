import "./App.css";
import { useState } from "react";
import React from "react";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { UserProvider } from "./contexts/UserContext";

import Landing from "./views/landing";
import Background from "../src/components/background";
import Dashboard from "./views/dashboard";
import PlayGame from "./views/playGame";
import Game from "./views/game";
import Leaderboard from "./views/leaderboard";
import MatchHistory from "./views/matchHistory";

import Signup from "./views/signup";
import Login from "./views/login";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // Set different views for the app.
  const [currentView, setCurrentView] = useState("landing");

  const renderView = (view) => {
    if (view === currentView) return;
    setCurrentView(view);
  };

  return (
    <UserProvider>
      <WebSocketProvider>
        {currentView !== "landing" &&
          currentView !== "signup" &&
          currentView !== "login" &&
          currentView !== "game" && (
            <Header currentView={currentView} onNavigate={renderView} />
          )}
        <div
          className="view-container"
          style={{
            height: ["landing", "signup", "login", "game"].includes(currentView)
              ? "100%"
              : "calc(100% - 82px)",
          }}
        >
          {currentView === "landing" && <Landing onNavigate={renderView} />}
          {currentView === "signup" && <Signup onNavigate={renderView} />}
          {currentView === "login" && <Login onNavigate={renderView} />}
          {currentView === "dashboard" && <Dashboard onNavigate={renderView} />}
          {currentView === "playgame" && <PlayGame onNavigate={renderView} />}
          {currentView === "game" && <Game onNavigate={renderView} />}
          {currentView === "leaderboard" && (
            <Leaderboard onNavigate={renderView} />
          )}
          {currentView === "history" && <MatchHistory onNavigate={renderView} />}
        </div>
        <Background />
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
