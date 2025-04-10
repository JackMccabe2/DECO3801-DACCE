
/*
 * function to add new player to database
 *
 * 
 * 
 */
async function initializePlayer(username, client) {
    try {
        const query = `
            INSERT INTO players (username, created_at, last_active, firewall_skill, leaderboard_score)
            VALUES ('${username}', '2025-03-28 13:10:11', '2025-03-28 13:10:11', 1, 1)
        `;
        
        await client.query(query);
        console.log("1 record inserted");
        return "success"
    } catch (err) {
        console.log("Error executing query:", err);
        if (err.constraint == "players_pkey") {
            return "duplicate"
        } else {
            return "error"
        }
    }
}

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
            return "success"; // Return the player data since there's only one result
        } else {
            console.log("Player not found");
            return "empty"; // Return null if no player is found
        }
    } catch (err) {
        console.log("Error executing query:", err);
        return "error"; // Return "error" if there's an issue with the query
    }
}

async function okMessage(ws, data) {
    const response = { status: "OK", message: data };
    console.log('[Server] Sending response:', response.status + " " + data.type);
    ws.send(JSON.stringify(response));
}

/*
 *  function to attempt to create specified user
 *  sends response back to client
 */
async function createUser(ws, data, client) {
    console.log("USER CREATION INITIATED: " + data.username);

    const initResult = await initializePlayer(data.username, client);  // Ensure you await the result if it's asynchronous
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

/*
 *  function to attempt to create specified user
 *  sends response back to client
 */
async function loginUser(ws, data, client) {
    console.log("USER GET INITIATED: " + data.username);

    const initResult = await getPlayer(data.username, client);  // Ensure you await the result if it's asynchronous
    console.log("Get result: " + initResult);

    let response;

    switch (initResult) {
        case "success":
            response = { 
                status: "OK USER LOGIN", 
                message: "user sucessully retrieved", 
                username: data.username 
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

module.exports = { okMessage, createUser, loginUser };