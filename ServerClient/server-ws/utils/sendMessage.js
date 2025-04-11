
async function okMessage(ws, data) {
    const response = { status: "OK", message: data };
    console.log('[Server] Sending response:', response.status + " " + data.type);
    ws.send(JSON.stringify(response));
}

module.exports = { okMessage };