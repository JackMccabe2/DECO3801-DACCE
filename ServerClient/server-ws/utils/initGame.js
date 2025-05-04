
import { okMessage } from './sendMessage.js';

export async function initGame(ws, gameId, data) {

    // generate random game id
    const id = Math.random().toString(16).slice(2);
    
    // create variable to track if user is added to game
    // if added, break the loop
    let added = false;

    // if the gamemode is multiplayer, attempt to find a match
    if (data.gamemode === 'M') {
        for (let i = 0; i < gameId.length; i++) {
            
            if (added == true) {
                break
            }
            
            const obj = gameId[i];
            const key = Object.keys(obj)[0]; // Get the dynamic key like '859353ec9410f'

            // change so that it matches most to user score IFFFFF multiple games present
            if (obj[key].gamemode === 'M' && obj[key].users.length === 1) {
                obj[key].users.push(data.user.username);
                obj[key].userdata.push(data.user);
                added = true;
            }
            
        }
    }

    // if user was not added to existing game, create new game for them
    if (added == false) {
        gameId.push({ [id]: { gamemode: data.gamemode, users: [data.user.username], userdata: [data.user] } });
    }

    console.dir(gameId, {depth: null});

    await okMessage(ws,"SENT OK");

}
