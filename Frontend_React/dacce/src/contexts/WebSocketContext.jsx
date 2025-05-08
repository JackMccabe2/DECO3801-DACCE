// WebSocketContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [message, setMessage] = useState(null); // single message or last message
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
        if (response.status === "OK GOT GAME") {
          setGameState(response.message);
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
      alert("connection error");
      // ADD "ON NAVIGATE" TO SERVER CONNECTION ERROR PAGE
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      alert("connection closed");
       // ADD "ON NAVIGATE" TO SERVER CONNECTION ERROR PAGE
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
  const sendMessage = (msg, onResponse = null) => {
    const payload = typeof msg === 'string' ? msg : JSON.stringify(msg);

    if (msg.type === 'log') {
      ws.current.send(msg);
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(payload);
      console.log("✅ Sent message:", payload);

      if (onResponse) {
        pendingResponses.current.push({ callback: onResponse });
      }
    } else {
      console.warn("❌ WebSocket not open:", ws.current?.readyState);
    }
  };

  const value = {
    isConnected,
    gameState, 
    setGameState,
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