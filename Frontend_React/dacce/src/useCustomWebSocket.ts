import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
interface WebsocketMessage {
  type: string;
  notifications: string[];
}

const useCustomWebSocket = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const socketUrl = "ws://localhost:8080";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("WebSocket connection established"),
      onClose: () => console.log("WebSocket connection closed"),
      onError: (error) => {
        console.error("WebSocket error:", error);
      },
      shouldReconnect: (closeEvent) => true, // Automatically reconnect
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as WebsocketMessage;
      try {
        setChatMessages((prev) => [...prev, ...message?.notifications]);
        //Put your logic here to classify the messages based on the type:
        //Go with a state management pattern to update your messages if you have complex apps
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    }
  }, [lastJsonMessage]);

  const send = (message: { type: string; content: string }) => {
    sendJsonMessage(message); // send the event to server
  };

  return {
    chatMessages,
    send,
    readyState,
  };
};

export default useCustomWebSocket;