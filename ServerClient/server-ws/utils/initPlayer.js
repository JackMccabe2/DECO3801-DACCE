
/*
 * function to initialize player to database
 *
 * 
 * 
 */
async function initializePlayer(username, client) {
    try {
        const query = `
            INSERT INTO players (username, created_at, last_active, firewall_skill, leaderboard_score)
            VALUES ('${username}', '2025-03-28 13:10:11', '2025-03-28 13:10:11', 1, 1)
            RETURNING *;
        `;
        
        const result = await client.query(query);
        console.log("1 record inserted");
        return {status: "success", data: result.rows[0]};
    } catch (err) {
        console.log("Error executing query:", err);
        if (err.constraint == "players_pkey") {
            return {status: "duplicate"}
        } else {
            return {status: "error"}
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
    console.log("Init result: " + initResult.data);

    let response;

    switch (initResult.status) {
        case "success":
            response = { 
                status: "OK USER CREATED", 
                message: "user successfully created", 
                user: initResult.data
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