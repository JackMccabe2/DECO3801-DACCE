
const { okMessage } = require('./sendMessage');
const { createUser } = require('./initPlayer'); // Import functions
const { loginUser } = require('./loginPlayer')


async function handleMessage(ws, message, client) {
    try {
        const data = JSON.parse(message.toString('utf-8'));
        console.log('[Server] Received message:', data);
        if (data.type === 'NAV') {
            // Send "OK" back to the client
            await okMessage(ws, data);
        } else if (data.status === 'log') {
            console.log('[Client] log: ', data);
        } else if (data.type === 'POST') {
            await createUser(ws, data, client);
        } else if (data.type === 'GET') {
            await loginUser(ws, data, client)
        } else {
            // Send "OK" back to the client
            await okMessage(ws, data);
        }
    } catch (err) {
        console.error('[Server] Invalid JSON or error:', message);
        const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
        ws.send(JSON.stringify(errorResponse)); // Send error message back
    }
}

module.exports = { handleMessage };