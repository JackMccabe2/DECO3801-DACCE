
import { okMessage } from './sendMessage.js';
import { createUser } from './userManip/initPlayer.js'; // Import functions
import { loginUser } from './userManip/loginPlayer.js';
import { initGame } from './gameStateManip/initGame.js';
import { getPuzzle } from './getPuzzle.js';
import { getLeaderboard } from './getLeaderboard.js';
import { leaveGame } from './gameStateManip/leaveGame.js';
import { deleteUser } from './userManip/deleteUser.js';
import { checkDuplicateUser } from './userManip/checkDuplicateUser.js';
import { correctScore } from './gameStateManip/correctScore.js';
import { userReady } from './gameStateManip/userReady.js';

export async function handleMessage(ws, message, client, gameId, users) {
    try {
        const data = JSON.parse(message.toString('utf-8'));
        console.log('[Server] Received message:', data.type);
        if (data.type === 'NAV') {
            // Send "OK" back to the client
            await okMessage(ws, data);
        } else if (data.status === 'log') {
            console.log('[Client] log: ' + data);
        } else if (data.type === 'log') {
            console.log('[Client] log username: ' + data.username);
        } else if (data.type === 'POST') {
            await createUser(ws, data, client, users);
        } else if (data.type === 'POST DUP') {
            await checkDuplicateUser(ws, data.username,client);
        } else if (data.type === 'GET USER') {
            await loginUser(ws, data, client, users);
        } else if (data.type === 'DELETE USER') {
            await deleteUser(ws, data, client, users);
        } else if (data.type === 'GET LEADERBOARD') {
            await getLeaderboard(ws, client);
        } else if (data.type === 'INIT GAME') {
            await initGame(ws, gameId, data, users);
        } else if (data.type === 'GET PUZZLE') {
            await getPuzzle(ws);
        } else if (data.type === 'EXIT GAME') {
            await leaveGame(ws, gameId, data, users);
        } else if (data.type === 'CORRECT ANSWER') {
            await correctScore(ws, gameId, data, client, users);
        } else if (data.type === 'USER READY') {
            await userReady(ws, gameId, data, users);
        } else {
            await okMessage(ws, data);
        }
    } catch (err) {
        console.error('[Server] Invalid JSON or error:', message);
        const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
        ws.send(JSON.stringify(errorResponse)); // Send error message back
    }
}