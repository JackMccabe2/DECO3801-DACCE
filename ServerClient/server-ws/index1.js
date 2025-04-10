// index1.js

// Dependencies
const express = require('express');
const WebSocket = require('ws');
const { Client } = require('pg');
const { okMessage, createUser } = require('./utils/sendMessage'); // Import functions

// Initialize Express Server
const server = express().listen(8080, () => {
    console.log('[Server] Opened connection on port 8080');
});

// Initialize WebSocket Server
const wss = new WebSocket.Server({ server });

// PostgreSQL Connection 
const client = new Client({
  host: "localhost",
  user: "jackmccabe",
  password: "password",
  database: "postgres",
  port: 5432
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

wss.on('connection', (ws) => {
    console.log('[Server] A client was connected.');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString('utf-8'));
            console.log('[Server] Received message:', data);
            if (data.type === 'NAV') {
                // Send "OK" back to the client
                await okMessage(ws, data);
            } else if (data.status === 'log') {
                console.log('[Client] log: ', data);
            } else if (data.type === 'POST') {
                await createUser(ws, data, client);
            } else {
                // Send "OK" back to the client
                await okMessage(ws, data);
            }
        } catch (err) {
            console.error('[Server] Invalid JSON or error:', message);
            const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
            ws.send(JSON.stringify(errorResponse)); // Send error message back
        }
    });

    ws.on('close', () => {
        console.log('[Server] Client disconnected.');
    });
});
