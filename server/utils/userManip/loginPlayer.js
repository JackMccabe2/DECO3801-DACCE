
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
            console.log("Player found:", result.rows[0].username);
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
export async function loginUser(ws, data, client, activeUsers) {

    let initResult;

    if (activeUsers.has(data.username)) {
        initResult = { status: "active" };
    } else {
        //console.log("Get result: ");    
        initResult = await getPlayer(data.username, client);
    }
    
    //console.log("Get result: " + initResult);



    let response;

    switch (initResult.status) {
        case "success":
            response = { 
                status: "OK USER LOGIN", 
                message: "user sucessully retrieved", 
                user: initResult.data
            };

            activeUsers.set(data.username, ws);
            ws.userId = data.username; // store on socket for cleanup later
            console.log(`User ${data.username} connected`);

            //activeUsers.push(data.username);
            //ws.userId = data.username;
            break;

        case "empty":
            response = { 
                status: "ERR USER NOT EXIST", 
                message: "user does not exists in the database", 
                user: data.username 
            };
            break;

        case "active":
            response = {
                status: "USER ACTIVE",
                message: "user already login into the game",
                user: data.username
            };
            break;

        default:
            response = { 
                status: "ERR OCCURRED", 
                message: "error occurred when adding user", 
                user: data.username 
            };
            break;
    }

    console.log('[Server] Sending response:', response.status,data.username);
    ws.send(JSON.stringify(response));
}
