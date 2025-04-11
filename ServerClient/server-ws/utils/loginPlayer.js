
/*
 * function to add new player to database
 *
 * 
 * 
 */
async function getPlayer(username, client) {
    try {
        const query = `
            SELECT * FROM players WHERE username = '` + username + `'
        `;
        
        const result = await client.query(query);
        
        if (result.rows.length === 1) {
            console.log("Player found:", result.rows[0]);
            return {status: "success", data: result.rows[0]}; // Return the player data since there's only one result
        } else {
            console.log("Player not found");
            return {status: "empty"}; // Return null if no player is found
        }
    } catch (err) {
        console.log("Error executing query:", err);
        return {status: "error"}; // Return "error" if there's an issue with the query
    }
}

/*
 *  function to attempt to create specified user
 *  sends response back to client
 */
async function loginUser(ws, data, client) {
    console.log("USER GET INITIATED: " + data.username);

    const initResult = await getPlayer(data.username, client);  // Ensure you await the result if it's asynchronous
    console.log("Get result: " + initResult);

    let response;

    switch (initResult.status) {
        case "success":
            response = { 
                status: "OK USER LOGIN", 
                message: "user sucessully retrieved", 
                user: initResult.data
            };
            break;

        case "empty":
            response = { 
                status: "ERR USER NOT EXIST", 
                message: "user does not exists in the database", 
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

module.exports = { loginUser };