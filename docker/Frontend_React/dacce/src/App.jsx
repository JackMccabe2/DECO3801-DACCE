import "./App.css";
import { useState, useEffect } from "react";
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
import Profile from "./views/profile";
import Matching from "./views/matching";
import MatchFound from "./views/matchfound";
import GameLoad from "./views/gameload";
import Error from "./views/error";

import Signup from "./views/signup";
import Login from "./views/login";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";

// Landing page music still TBD
import landingMusic from "./assets/music/landing page 2.mp3";
import inGameMusic from "./assets/music/in game.mp3";
import dashboardMusic from "./assets/music/dashboard and others 2.mp3";
import matchingMusic from "./assets/music/pairing match.mp3";

function App() {
  // Set different views for the app.
  const [currentView, setCurrentView] = useState("landing");
  const [audio, setAudio] = useState(null);

  const renderView = (view) => {
    if (view === currentView) return;
    setCurrentView(view);
  };

  // Play audio based on different views
  useEffect(() => {
    const viewToAudioMap = {
      sharedLandingAudio: landingMusic,
      sharedDashboardAudio: dashboardMusic,
      sharedinGameAudio: inGameMusic,
      sharedMatchingAudio: matchingMusic,
    };

    const sharedLandingAudio = ["signup", "login", "error"];
    const sharedDashboardAudio = [
      "dashboard",
      "profile",
      "playgame",
      "leaderboard",
      "history",
    ];
    const sharedinGameAudio = ["game"];
    const sharedMatchingAudio = ["matching", "matchfound", "gameload"];

    let audioToPlay = null;
    if (sharedLandingAudio.includes(currentView)) {
      audioToPlay = viewToAudioMap["sharedLandingAudio"];
    } else if (sharedDashboardAudio.includes(currentView)) {
      audioToPlay = viewToAudioMap["sharedDashboardAudio"];
    } else if (sharedinGameAudio.includes(currentView)) {
      audioToPlay = viewToAudioMap["sharedinGameAudio"];
    } else if (sharedMatchingAudio.includes(currentView)) {
      audioToPlay = viewToAudioMap["sharedMatchingAudio"];
    }

    // Normalise audioToPlay to absolute path (avoid replaying the same audio when views are the same)
    const newAudioSrc = audioToPlay
      ? new URL(audioToPlay, window.location.origin).href
      : null;

    if (audio && audio.src === newAudioSrc) {
      return;
    }

    if (audio) {
      audio.pause();
    }

    // Set audio fade-in on view change
    if (audioToPlay) {
      const newAudio = new Audio(audioToPlay);
      newAudio.loop = true;
      newAudio.volume = 0;

      newAudio
        .play()
        .then(() => {
          setAudio(newAudio);

          let volume = 0;
          const fadeInInterval = setInterval(() => {
            if (volume < 1) {
              volume += 0.1;
              newAudio.volume = Math.min(volume, 1);
            } else {
              clearInterval(fadeInInterval);
            }
          }, 500);
        })
        .catch((error) => {
          console.error("Audio playback error:", error);
        });
    }
  }, [currentView]);

  return (
    <UserProvider>
      <WebSocketProvider onNavigate={renderView}>
        {currentView !== "landing" &&
          currentView !== "signup" &&
          currentView !== "login" &&
          currentView !== "matching" &&
          currentView !== "matchfound" &&
          currentView !== "gameload" &&
          currentView !== "error" &&
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
          {currentView === "profile" && <Profile onNavigate={renderView} />}
          {currentView === "playgame" && <PlayGame onNavigate={renderView} />}
          {currentView === "matching" && <Matching onNavigate={renderView} />}
          {currentView === "matchfound" && (
            <MatchFound onNavigate={renderView} />
          )}
          {currentView === "gameload" && <GameLoad onNavigate={renderView} />}
          {currentView === "game" && <Game onNavigate={renderView} />}
          {currentView === "leaderboard" && (
            <Leaderboard onNavigate={renderView} />
          )}
          {currentView === "history" && (
            <MatchHistory onNavigate={renderView} />
          )}
          {currentView === "error" && <Error onNavigate={renderView} />}
        </div>
        <Background />
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
