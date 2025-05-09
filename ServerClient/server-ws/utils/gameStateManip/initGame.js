import { okMessage } from '../sendMessage.js';

export async function initGame(ws, gameId, data) {

    try {
    
        // generate random game id
        const id = Math.random().toString(16).slice(2);
        
        // create variable to track if user is added to game
        // if added, break the loop
        let added = false;

        let userGame;

        // if the gamemode is multiplayer, attempt to find a match
        if (data.gamemode === 'M') {
            for (let i = 0; i < gameId.length; i++) {
                if (added) break;

                const obj = gameId[i];
                const key = Object.keys(obj)[0];

                // change so that it matches most to user score IFFFFF multiple games present
                if (obj[key].gamemode === 'M' && Object.keys(obj[key].users).length === 1) {
                    obj[key].users[data.user.username] = 0;  // Add user to users object
                    obj[key].userdata.push(data.user);       // Push user data
                    userGame = obj;
                    added = true;
                }
                
            }
        }

        // If user not added, create new game
        if (!added) {
            const newGame = {
                [id]: {
                    gamemode: data.gamemode,
                    users: { [data.user.username]: 0 },
                    userdata: [data.user]
                }
            };
            gameId.push(newGame);
            userGame = newGame;
        }

        //console.dir(gameId, {depth: null});

        const response = {
            status: "OK GOT GAME",
            message: userGame
        };

        console.log('[Server] Sending response:', response.status, response.message);
        ws.send(JSON.stringify(response));

    } catch (err) {
        console.error('[Server] Error initializing game:', err);
        const errorResponse = { status: "ERROR", message: "Error initializing game" };
        ws.send(JSON.stringify(errorResponse));
    }
}

//         title={`Encrypted Message... ${user} score: ${gameState[Object.keys(gameState)[0]].users[username]}`}