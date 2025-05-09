export async function correctScore(ws, gameId, data, client, users) {
    const user = data.message.username;
    const uniqueGameId = data.message.gameId;

    let otherUser = null;
    let currentGame = null;

    // Find the correct game and update the score
    for (const entry of gameId) {
        if (entry[uniqueGameId]) {
            currentGame = entry;
            const gameData = entry[uniqueGameId];

            // Ensure the user exists and increment their score
            if (gameData.users.hasOwnProperty(user)) {
                gameData.users[user] += 1;
            }

            // Identify the opponent
            const userKeys = Object.keys(gameData.users);
            otherUser = userKeys.find(u => u !== user);
            break;
        }
    }

    if (!currentGame) {
        console.error('[Server] Game not found for ID:', uniqueGameId);
        return;
    }

    const response = {
        status: "OK GOT GAME",
        message: currentGame
    };

    console.log('[Server] Sending response:', response.status, response.message);
    ws.send(JSON.stringify(response));

    // Notify the other user if conditions are met
    const targetWs = users.get(otherUser);
    if (targetWs && targetWs.readyState === WebSocket.OPEN && currentGame[uniqueGameId].gamemode === 'M') {
        targetWs.send(JSON.stringify(response));
    }
}
