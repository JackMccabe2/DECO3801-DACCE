
const { okMessage, createUser } = require('./sendMessage');

async function handleMessage(ws, message) {
    try {
        const data = JSON.parse(message.toString('utf-8'));
        console.log('[Server] Received message:', data);
        if (data.type === 'NAV') {
            // Send "OK" back to the client
            okMessage(ws, data)
        } else if (data.status === 'log') {
            console.log('[Client] log: ', data)
        } else if (data.type === 'POST') {
            createUser(ws, data)
        } else {
            // Send "OK" back to the client
            okMessage(ws, data)
        }
    } catch (err) {
        console.error('[Server] Invalid JSON or error:', message);
        const errorResponse = { status: "ERROR", message: "Invalid JSON or processing error" };
        ws.send(JSON.stringify(errorResponse)); // Send error message back
    }
}

module.exports = { handleMessage };