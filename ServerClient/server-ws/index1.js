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
                await createUser(ws, data);
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
        return "success"
    } catch (err) {
        console.log("Error executing query:", err.constraint);
        if (err.constraint == "players_pkey") {
            return "duplicate"
        } else {
            return "error"
        }
    }
}

/**
 * Function to get player information from the database by username
 */
async function getPlayer(username) {
    try {
        const query = `
            SELECT * FROM players WHERE username = '` + username + `'
        `;
        
        const result = await client.query(query);
        
        if (result.rows.length === 1) {
            console.log("Player found:", result.rows[0]);
            return result.rows[0]; // Return the player data since there's only one result
        } else {
            console.log("Player not found");
            return null; // Return null if no player is found
        }
    } catch (err) {
        console.log("Error executing query:", err);
        return "error"; // Return "error" if there's an issue with the query
    }
}
