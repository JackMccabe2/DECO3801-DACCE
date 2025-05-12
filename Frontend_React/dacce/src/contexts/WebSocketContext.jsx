// WebSocketContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from "./UserContext";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, onNavigate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [message, setMessage] = useState(null); // single message or last message
  const { setUser } = useUser();
  const ws = useRef(null);

  // Holds callbacks waiting for certain responses
  const pendingResponses = useRef([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      const loginPayload = { type: "init", username: "connection" };
      
      sendMessage(loginPayload, (response) => {
        if (response.status === "OK") {
          setIsConnected(true);
        } else {
          alert("Unable to connect.");
          return;
        }
      });
    };
    
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('[Client] Received message:', response);

      // Show alert if status/message format is present
      if (response?.status && response?.message !== undefined) {
        //alert(response.status);
        if (response.status === "OK GOT GAME") {
          setGameState(response.message);
          setGameStatus(true);
        } else if (response.status === "GAME OVER") {
          setGameState(response.message);
          setGameStatus("over");
        } else if (response.status === "UPDATE USER") {
          setUser(response.user);
        }
      }

      setMessage(response);

      pendingResponses.current.forEach(({ callback }) => {
        callback(response);
      });

      pendingResponses.current = [];
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      onNavigate("error");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      onNavigate("error");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  /**
   * Send a message and optionally provide a callback
   * that handles the server's response to this message.
   */
  const sendMessage = async (msg, onResponse = null) => {
    const payload = typeof msg === 'string' ? msg : JSON.stringify(msg);
  
    try {
      //await waitForWebSocketOpen(ws.current);
  
      // Send log message if needed
      if (msg.type === 'log') {
        ws.current.send(JSON.stringify(msg)); // ensure it's stringified
      }
  
      ws.current.send(payload);
      console.log("✅ Sent message:", payload);
  
      if (onResponse) {
        return new Promise((resolve) => {
          pendingResponses.current.push({
            callback: (response) => {
              onResponse(response); // user-defined callback
              resolve(response);    // resolves sendMessage
            }
          });
        });
      }
  
      return Promise.resolve(); // resolve immediately if no response expected
    } catch (err) {
      console.warn("❌ WebSocket error:", err.message);
      return Promise.reject(err);
    }
  };

  const value = {
    isConnected,
    gameState, 
    setGameState,
    gameStatus, 
    setGameStatus,
    //message,
    sendMessage,
    ws: ws.current
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};