// index1.js

// Dependencies
import express from 'express';
import { WebSocketServer } from 'ws';
import pkg from 'pg';
const { Client } = pkg;
import { handleMessage } from './utils/handleMessage.js';

// Initialize Express Server
const server = express().listen(8080, () => {
    console.log('[Server] Opened connection on port 8080');
});

// Initialize WebSocket Server
const wss = new WebSocketServer({ server }); // Use WebSocketServer here

// PostgreSQL Connection 

const client = new Client({
  host: "localhost",
  user: "jackmccabe",
  password: "password",
  database: "postgres",
  port: 5432
});

/*
const client = new Client({
  host: "localhost",
  user: "georgiadocherty",
  password: "password",
  database: "postgres",
  port: 5432
});
*/
/*
const client = new Client({
  host: "localhost
  user: "josh",
  password: "password1",
  database: "postgres",
  port: 5432"
  });
*/

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

let gameId = []
let activeUsers = []

wss.on('connection', (ws) => {
    console.log('[Server] A client was connected.');
    ws.userId = null;

    ws.on('message', async (message) => {
        
        await handleMessage(ws, message, client, gameId, activeUsers);

    });

    ws.on('close', () => {
      const index = activeUsers.indexOf(ws.userId);
      if (index !== -1) {
        activeUsers.splice(index, 1);
      }
      console.log('[Server] Client disconnected. Updated active users: ' + activeUsers);
    });
});