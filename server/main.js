// main.js


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

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

let gameId = []
const users = new Map();

wss.on('connection', (ws) => {
    console.log('[Server] A client was connected.');
    ws.userId = null;

    ws.on('message', async (message) => {
        
        await handleMessage(ws, message, client, gameId, users);

    });

    ws.on('close', () => {

      if (ws.userId) {
        users.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
      }

      //console.log('[Server] Client disconnected. Updated active users: ' + users);
    });
});