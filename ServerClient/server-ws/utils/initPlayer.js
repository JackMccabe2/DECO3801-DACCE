
/*
 * function to add initialize player to database
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

module.exports = { createUser };