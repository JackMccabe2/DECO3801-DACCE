// index1.js

// Dependencies
const express = require('express');
const WebSocket = require('ws');
const { Client } = require('pg');
const { handleMessage } = require('./utils/handleMessage')

// Initialize Express Server
const server = express().listen(8080, () => {
    console.log('[Server] Opened connection on port 8080');
});

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

// PostgreSQL Connection 
const client = new Client({
  host: "localhost",
  user: "wenkao",
  password: "testtest",
  database: "postgres",
  port: 5432
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

wss.on('connection', (ws) => {
    console.log('[Server] A client was connected.');

    ws.on('message', async (message) => {
        
        await handleMessage(ws, message, client);

    });

    ws.on('close', () => {
        console.log('[Server] Client disconnected.');
    });
});
