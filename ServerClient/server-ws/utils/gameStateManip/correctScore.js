async function addScore(username, client) {
    try {
        const query = `
            UPDATE players
            SET leaderboard_score = leaderboard_score + 1
            WHERE username = $1
            RETURNING *;
        `;

        const result = await client.query(query, [username]);
        console.log("1 record updated");
        return { status: "UPDATE USER", data: result.rows[0] };
    } catch (err) {
        console.log("Error executing query:", err);
        return { status: "ERROR UPDATING USER" };
    }
}

export async function correctScore(ws, gameId, data, client, users) {
    const user = data.message.username;
    const uniqueGameId = data.message.gameId;

    let opponent = null;
    let currentGame = null;
    let status = "OK GOT GAME";

    // Find the correct game and update the score
    for (const entry of gameId) {
        if (entry[uniqueGameId]) {
            currentGame = entry;
            const gameData = entry[uniqueGameId];

            // Ensure the user exists and increment their score
            if (gameData.users.hasOwnProperty(user)) {
                gameData.users[user] += 1;
                if (gameData.users[user] >= 1) {
                    status = "GAME OVER";
                    const userUpdate = await addScore(user, client);


                    
                    const payload = { 
                        status: userUpdate.status,
                        user: userUpdate.data 
                    };

                    console.log('[Server] Sending response:', payload.status, payload.user);
                    ws.send(JSON.stringify(payload));
                }
            }

            // Identify the opponent
            const userKeys = Object.keys(gameData.users);
            opponent = userKeys.find(u => u !== user);
            break;
        }
    }

    if (!currentGame) {
        console.error('[Server] Game not found for ID:', uniqueGameId);
        return;
    }

    if (status === "GAME OVER") {
        gameId = gameId.filter(game => game !== currentGame);
    }

    const response = {
        status: status,
        message: currentGame
    };

    console.log('[Server] Sending response:', response.status, response.message);
    ws.send(JSON.stringify(response));

    // Notify the other user if conditions are met
    const targetWs = users.get(opponent);
    if (targetWs && targetWs.readyState === WebSocket.OPEN && currentGame[uniqueGameId].gamemode === 'M') {
        console.log('[Server] Sending response to opponent:', response.status, response.message);
        targetWs.send(JSON.stringify(response));
    }

    // upload to game_results db
}
