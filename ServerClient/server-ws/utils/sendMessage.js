async function okMessage(ws, data) {
    const response = { status: "OK", message: data };
    console.log('[Server] Sending response:', response.status + " " + data.type);
    ws.send(JSON.stringify(response));
}

/*
 *  function to attempt to create specified user
 *  sends response back to client
 */
async function createUser(ws, data) {
    console.log("USER CREATION INITIATED");

    const initResult = await initializePlayer(data.username);  // Ensure you await the result if it's asynchronous
    console.log("Init result: " + initResult);

    let response;

    switch (initResult) {
        case "success":
            response = { 
                status: "OK USER CREATED", 
                message: "user successfully created", 
                username: data.username 
            };
            break;

        case "duplicate":
            response = { 
                status: "ERR USER EXISTS", 
                message: "user already exists in the database", 
                username: data.username 
            };
            break;

        default:
            response = { 
                status: "ERR OCCURRED", 
                message: "error occurred when adding user", 
                username: data.username 
            };
            break;
    }

    console.log('[Server] Sending response:', response);
    ws.send(JSON.stringify(response));
}

module.exports = { okMessage, createUser };