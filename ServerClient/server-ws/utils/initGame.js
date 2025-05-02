
import { okMessage } from './sendMessage.js';

export async function initGame(ws, gameId, data) {

    const id = Math.random().toString(16).slice(2);
    //const id = "test"

    // add logic to match users in same game
    
    let added = false;

    for (let i = 0; i < gameId.length; i++) {
        
        if (added == true) {
            break
        }
        
        const obj = gameId[i];
        const key = Object.keys(obj)[0]; // Get the dynamic key like '859353ec9410f'
        console.log("gamemode: ",obj[key].gamemode,"number users:",obj[key].users.length)

        // change so that it matches most to user score IFFFFF multiple games present
        if (obj[key].gamemode === 'M' && obj[key].users.length === 1) {
          console.log("FOUDN MATCHDFS");
          obj[key].users.push(data.user.username);
          obj[key].userdata.push(data.user);
          added = true;
        }
        
    }
    
    if (added == false) {
        //console.log("added false")
        gameId.push({ [id]: { gamemode: data.gamemode, users: [data.user.username], userdata: [data.user] } });
    }

    //await wait(1000);
    //console.log(gameId);
    console.dir(gameId, {depth: null});


    okMessage(ws,"SENT OK")

}
