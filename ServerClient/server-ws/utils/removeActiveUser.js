import { okMessage } from './sendMessage.js';

export async function removeActiveUser(ws, users, message) {

    if (ws.userId) {
        users.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
    } 

    okMessage(ws,"user logged out");
}
