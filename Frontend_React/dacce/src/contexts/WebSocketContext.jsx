import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      ws.current.send(JSON.stringify({ type: "init", username: "connection" }));
    };
    
    ws.current.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log('[Client] Received message:', response);

      ws.current.send(JSON.stringify({ status: "log", message: "response status: " + response.status}));

      // Handle the response from the server
      if (response.status === 'OK') {
          console.log('[Client] Received OK');
          ws.current.send(JSON.stringify({ status: "log", message: "status: " + status}));
      } else {
          console.error('[Client] Error:', response.message);
          setMessage('Error: ' + response.message);
      }
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

  const sendMessage = (msg) => {
    console.log("Preparing to send:", msg);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(msg);
      console.log("✅ Sent message:", msg);
    } else {
      console.warn("❌ WebSocket not open:", ws.current?.readyState);
    }
  };

  const value = {
    isConnected,
    message,
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