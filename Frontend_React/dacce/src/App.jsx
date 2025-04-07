import "./App.css";
import { useState } from "react";
import React from "react";
import { WebSocketProvider } from "./utils/socketContext";

import Landing from "./views/landing";
import Background from "../src/components/background";
import Dashboard from "./views/dashboard";
import PlayGame from "./views/playGame";
import Game from "./views/game";

import Signup from "./views/signup";
import Login from "./views/login";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // Set different views for the app.
  const [currentView, setCurrentView] = useState("landing");
  // Do nothing if current view is landing, otherwise set new view.
  const renderView = (view) => {
    if (view === currentView) {
      return;
    }
    setCurrentView(view);
  };

  return (
    <>
      <WebSocketProvider>
      <div className="view-container">
        {/* Only show header when views are not any of the following */}
        {currentView !== "landing" &&
          currentView !== "signup" &&
          currentView !== "login" && (
            <Header currentView={currentView} onNavigate={renderView} />
          )}
        {currentView === "landing" && <Landing onNavigate={renderView} />}
        {currentView === "signup" && <Signup onNavigate={renderView} />}
        {currentView === "login" && <Login onNavigate={renderView} />}
        {currentView === "dashboard" && <Dashboard onNavigate={renderView} />}
        {currentView === "playgame" && <PlayGame onNavigate={renderView} />}
        {currentView === "game" && <Game onNavigate={renderView} />}
      </div>
      <Background />
      </WebSocketProvider>
    </>
  );
}

export default App;
