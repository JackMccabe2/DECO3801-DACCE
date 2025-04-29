
import { okMessage } from './sendMessage.js';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initGame(ws, gameId, data) {

    const id = Math.random().toString(16).slice(2);
    //const id = "test"

    // add logic to match users in same game
    gameId.push({ [id]: { gamemode: data.gamemode, users: data.user.username, userdata: data.user } });

    //await wait(1000);
    console.log(gameId)

    okMessage(ws,"SENT OK")

}

//module.exports = { initGame };