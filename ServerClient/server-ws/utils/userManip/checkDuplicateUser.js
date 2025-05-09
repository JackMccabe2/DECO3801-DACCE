
async function getPlayer(username,client) {
    try {
        const query = `
            SELECT * FROM players WHERE username = '` + username + `'
        `;
        
        const result = await client.query(query);
        
        if (result.rows.length === 1) {
            console.log("Player found:", result.rows[0].username);
            return {status: "duplicate", data: result.rows[0]}; // Return the player data since there's only one result
        } else {
            console.log("Player not found");
            return {status: "empty"}; // Return null if no player is found
        }
    } catch (err) {
        console.log("Error executing query:", err);
        return {status: "error"}; // Return "error" if there's an issue with the query
    }
}

export async function checkDuplicateUser(ws, username, client) {
    
    const result = await getPlayer(username, client);

    let response;

    switch (result.status) {
        case "duplicate":
            response = { 
                status: "ERR USER EXISTS", 
                message: "user already exists in system", 
                user: result.data
            };
            //activeUsers.push(username);
            //ws.userId = username;
            break;

        case "empty":
            response = { 
                status: "OK", 
                message: "user does not exists in the database", 
                user: username 
            };
            break;

        default:
            response = { 
                status: "ERR OCCURRED", 
                message: "error occurred when adding user", 
                user: username 
            };
            break;
    }

    console.log('[Server] Sending response:', response.status,username);
    ws.send(JSON.stringify(response));
}
