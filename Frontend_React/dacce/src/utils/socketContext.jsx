
// DEPRECIATED FILE!!!

/*
import React, { createContext, useContext, useEffect, useState } from "react";
import { Html5WebSocket } from "html5-websocket";
import ReconnectingWebSocket from "reconnecting-websocket";

// Create the WebSocket context
const WebSocketContext = createContext(null);

// Provides a convenient way to access the WebSocket context in any component
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection only once
    const ws_host = "localhost";
    const ws_port = "3000";
    const options = { constructor: Html5WebSocket };

    // ReconnectWebSocket is used to automatically reconnect the WebSocket if it closes
    const rws = new ReconnectingWebSocket(
      `ws://${ws_host}:${ws_port}/ws`,
      undefined,
      options
    );
    rws.timeout = 1000;

    // Set up WebSocket event listeners
    rws.addEventListener("open", () => {
      console.log("[Client] Connection to WebSocket was opened.");
      setSocket(rws); // Set the socket after connection is established
    });

    rws.addEventListener("message", (e) => {
      console.log("[Client] Message received: " + e.data);
      try {
        let m = JSON.parse(e.data);
        handleMessage(m);
      } catch (err) {
        console.log("[Client] Message is not parseable to JSON.");
      }
    });

    rws.addEventListener("close", () => {
      console.log("[Client] Connection closed.");
      alert("WebSocket connection closed. Please refresh the page or try again later.");
    });

    rws.onerror = (err) => {
      console.error("[Client] WebSocket error:", err);
      if (err.code === "EHOSTDOWN") {
        console.log("[Client] Error: server down.");
      }
      alert("WebSocket error occurred. Please check your internet connection or the server status.");
    };

    // Cleanup WebSocket connection when component is unmounted or when connection is closed
    return () => {
      console.log("[Client] Cleanup WebSocket connection.");
      rws.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
*/