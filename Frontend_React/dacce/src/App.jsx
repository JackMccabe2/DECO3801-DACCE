import "./App.css";
import { useState } from "react";

import Landing from "./views/landing";
import Background from "../src/components/background";
import Dashboard from "./views/dashboard";
import PlayGame from "./views/playGame";

import Signup from "./views/signup";
import Login from "./views/login";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
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
      <div className="view-container">
        {currentView === "landing" && <Landing onNavigate={renderView} />}
        {currentView === "signup" && <Signup onNavigate={renderView} />}
        {currentView === "login" && <Login onNavigate={renderView} />}
        {currentView === "dashboard" && <Dashboard onNavigate={renderView} />}
        {currentView === "playgame" && <PlayGame onNavigate={renderView} />}
      </div>
      <Background />
    </>
  );
}

export default App;
