
const { okMessage } = require('./sendMessage');
const { createUser } = require('./initPlayer'); // Import functions
const { loginUser } = require('./loginPlayer');
const { initGame } = require('./initGame');
const { getPuzzle } = require('./getPuzzle');
const { getLeaderboard } = require('./getLeaderboard');
const { leaveMultiplayerGame } = require('./leaveMultiplayerGame');

async function handleMessage(ws, message, client, gameId, activeUsers, currentUser) {
    try {
        const data = JSON.parse(message.toString('utf-8'));
        console.log('[Server] Received message:', data);
        if (data.type === 'NAV') {
            // Send "OK" back to the client
            await okMessage(ws, data);
        } else if (data.status === 'log') {
            console.log('[Client] log: ' + data);
        } else if (data.type === 'log') {
            console.log('[Client] log username: ' + data.username);
        } else if (data.type === 'POST') {
            await createUser(ws, data, client, activeUsers);
        } else if (data.type === 'GET USER') {
            await loginUser(ws, data, client, activeUsers);
        } else if (data.type === 'GET LEADERBOARD') {
            await getLeaderboard(ws, client);
        } else if (data.type === 'INIT GAME') {
            await initGame(ws, gameId, data);
        } else if (data.type === 'GET PUZZLE') {
            // Get puzzle question and answer
            await getPuzzle(ws);
            //await initMultiplayer(ws, gameId);
        } else if (data.type === 'EXIT GAME') {
            await leaveMultiplayerGame(ws, gameId, data);
        } else {
            // Send "OK" back to the client
            await okMessage(ws, data);
        }
    } catch (err) {
        console.error('[Server] Invalid JSON or error:', message);
        const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
        ws.send(JSON.stringify(errorResponse)); // Send error message back
    }
}

module.exports = { handleMessage };