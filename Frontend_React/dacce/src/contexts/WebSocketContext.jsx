// WebSocketContext.jsx

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null); // single message or last message
  const ws = useRef(null);

  // Holds callbacks waiting for certain responses
  const pendingResponses = useRef([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      ws.current.send(JSON.stringify({ type: "init", username: "connection" }));
    };
    
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('[Client] Received message:', response);

      // Set the latest message (can be used in UI)
      setMessage(response);

      // Handle any matching pending responses
      pendingResponses.current.forEach((callbackObj) => {
        callbackObj.callback(response);
      });

      // Clear all handlers after use (or optionally keep them conditionally)
      pendingResponses.current = [];
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
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

  const handleRequest = (page, payload, onSuccess, onFailure) => {
    //const loginPayload = { type: "NAV", username: page };
  
    sendMessage(payload, (response) => {
      if (response.status === "OK") {
        onSuccess?.(page);
      } else {
        console.error("Login failed:", response.message);
        onFailure?.(response.message);
      }
    });
  };

  const value = {
    isConnected,
    message,
    sendMessage,
    handleRequest,
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