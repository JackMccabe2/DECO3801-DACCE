import "./App.css";
import { useState } from "react";

import Landing from "./views/landing";
import Background from "../src/components/background";
import Header from "../src/components/header";
import Dashboard from "./views/dashboard";

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
      </div>
      <Background />

      {/* <section className="landing"></section>
      <Landing />
      <Header />
      <main className="main-content">
        <Dashboard />
      </main> */}
    </>
  );
}

export default App;
