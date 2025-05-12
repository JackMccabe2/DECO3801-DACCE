export async function leaveGame(ws, gameIdList, data, users) {
    const username = data.message.username;
    let userRemoved = false;

    for (let i = 0; i < gameIdList.length; i++) {
        const game = gameIdList[i];

        for (const [id, gameData] of Object.entries(game)) {
            if (gameData.users.hasOwnProperty(username)) {
                // Remove user from users and userdata
                delete gameData.users[username];
                gameData.userdata = gameData.userdata.filter(u => u.username !== username);
                userRemoved = true;

                console.log(`[Server] User '${username}' removed from game '${id}'.`);

                const opponentUsernames = Object.keys(gameData.users);
                const opponent = opponentUsernames.length > 0 ? opponentUsernames[0] : null;

                if (opponent) {
                    // Send message to opponent if they're still in game
                    gameData.users[opponent] = -1; // Optional: mark opponent as waiting or game ended

                    const response = {
                        status: "OK GOT GAME",
                        message: game
                    };

                    const targetWs = users.get(opponent);
                    if (targetWs && targetWs.readyState === WebSocket.OPEN && gameData.gamemode === 'M') {
                        console.log('[Server] Sending response to opponent:', response.status, response.message);
                        targetWs.send(JSON.stringify(response));
                    }
                }

                // Delete the game regardless
                gameIdList.splice(i, 1);
                console.log(`[Server] Game '${id}' deleted because a user left.`);

                break; // Exit inner loop
            }
        }

        if (userRemoved) break; // Exit outer loop
    }

    if (!userRemoved) {
        console.log(`[Server] User '${username}' was not found in any game.`);
    }

    // Send response to the user who left
    const response = {
        status: userRemoved ? "OK" : "NOT_FOUND",
        message: data
    };
    console.log('[Server] Sending response:', response.status + " " + data.type);
    ws.send(JSON.stringify(response));

    // Log remaining games
    gameIdList.forEach(entry => {
        const gameId = Object.keys(entry)[0];
        const remainingUsers = Object.keys(entry[gameId].users);
        console.log(`[Server] gameIds: '${gameId}': ${remainingUsers}`);
    });
}
