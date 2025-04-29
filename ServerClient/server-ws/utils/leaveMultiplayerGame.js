
async function leaveMultiplayerGame(ws, gameIdList, data) {
    console.log("data: ", data);

    const username = data.message.username; // Correct field
    let userRemoved = false;

    // Loop through each object inside the array
    for (let i = 0; i < gameIdList.length; i++) {
        const game = gameIdList[i];

        for (const [id, user] of Object.entries(game)) {
            if (user.users === username) {
                // Found the user, now remove the entry
                delete game[id];
                userRemoved = true;
                console.log(`[Server] User '${username}' removed from game '${id}'.`);

                // If no users left in the game, remove the entire game object from the list
                if (Object.keys(game).length === 0) {
                    gameIdList.splice(i, 1);
                    console.log(`[Server] Game '${id}' deleted because no players left.`);
                }
                break;
            }
        }
        if (userRemoved) break; // No need to keep looping
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

    console.log("gameIdList: ", JSON.stringify(gameIdList, null, 2));
}

module.exports = { leaveMultiplayerGame };
