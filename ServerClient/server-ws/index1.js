/*

Server file that communicates with database
Call node index1.js to run

*/

// Dependencies
const express = require('express');
const WebSocket = require('ws');
const { Client } = require('pg');

// Initialize Express Server
const server = express().listen(3000, () => {
    console.log('[Server] Opened connection on port 3000');
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
        console.log('[Server] Received message:', message);

        const messageString = message.toString('utf-8');
        console.log(messageString);

        try {
            
            await initializePlayer("jackMccabe");

        } catch (err) {
            console.error('[Server] Error processing message:', err);
        }
    });

    ws.on('close', () => {
        console.log('[Server] Client disconnected.');
    });
});

/**
 * Function to add or update a player in the database
 */
async function initializePlayer(username) {
    try {
        const query = `
            INSERT INTO players (username, created_at, last_active, firewall_skill, leaderboard_score)
            VALUES ('`+username+`', '2025-03-28 13:10:11', '2025-03-28 13:10:11', 1, 1)
        `;
        
        await client.query(query);
        console.log("1 record inserted");
    } catch (err) {
        console.error("Error executing query:", err);
    }
}
