export async function leaveMultiplayerGame(ws, gameIdList, data) {
    const username = data.message.username;
    let userRemoved = false;

    for (let i = 0; i < gameIdList.length; i++) {
        const game = gameIdList[i];

        for (const [id, gameData] of Object.entries(game)) {
            if (gameData.users.hasOwnProperty(username)) {
                // Remove the user from the 'users' object
                delete gameData.users[username];

                // Remove the corresponding userdata entry
                gameData.userdata = gameData.userdata.filter(u => u.username !== username);

                userRemoved = true;
                console.log(`[Server] User '${username}' removed from game '${id}'.`);

                // If no users left in the game, remove the entire game object from the list
                if (Object.keys(gameData.users).length === 0) {
                    gameIdList.splice(i, 1);
                    console.log(`[Server] Game '${id}' deleted because no players left.`);
                }

                break; // Exit inner for-loop
            }
        }

        if (userRemoved) break; // Exit outer for-loop
    }

    if (!userRemoved) {
        console.log(`[Server] User '${username}' was not found in any game.`);
    }

    // Send a response back to the client
    const response = {
        status: userRemoved ? "OK" : "NOT_FOUND",
        message: data
    };

    console.log('[Server] Sending response:', response.status + " " + data.type);
    ws.send(JSON.stringify(response));

    // Log remaining games and users
    gameIdList.forEach(entry => {
        const gameId = Object.keys(entry)[0];
        const users = Object.keys(entry[gameId].users);
        console.log(`[Server] gameIds: '${gameId}': ${users}`);
    });
}
