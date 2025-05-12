import { okMessage } from '../sendMessage.js';

export async function userReady(ws, gameIdArray, data, users) {
    try {
        const targetGameId = data.message.gameId;
        const targetUsername = data.message.username;

        let userGame;
        let opponent = null;

        for (const obj of gameIdArray) {
            const key = Object.keys(obj)[0];

            if (key === targetGameId) {
                const game = obj[key];

                if (game.users.hasOwnProperty(targetUsername)) {
                    game.users[targetUsername] = 0;
                    console.log(`[Server] Reset score for ${targetUsername} in game ${targetGameId}`);
                } else {
                    console.warn(`[Server] Username ${targetUsername} not found in game ${targetGameId}`);
                }

                // Determine opponent
                const usernames = Object.keys(game.users);
                opponent = usernames.find(name => name !== targetUsername);

                userGame = obj;
                break;
            }
        }

        const response = {
            status: "OK GOT GAME",
            message: userGame
        };

        // send game state to current user
        console.log('[Server] Sending response to user:', response.status, response.message);
        ws.send(JSON.stringify(response));

        // Only send to opponent if both users have score 0
        if (userGame) {
            const game = userGame[targetGameId];
            const allScoresZero = Object.values(game.users).every(score => score === 0);

            if (allScoresZero && opponent) {
                const targetWs = users.get(opponent);
                if (targetWs && targetWs.readyState === WebSocket.OPEN) {
                    console.log('[Server] Sending response to opponent:', response.status, response.message);
                    targetWs.send(JSON.stringify(response));
                }
            }
        }

    } catch (err) {
        console.error('[Server] Invalid JSON or error:', err.message);
        const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
        ws.send(JSON.stringify(errorResponse));
    }
}
