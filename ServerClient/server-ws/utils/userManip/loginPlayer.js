
/*
 * function to add new player to database
 *
 * 
 * 
 */
/*
 * function to get player from database by username and password
 * returns distinct status for: success, wrong password, user not found
 */
async function getPlayer(username, password, client) {
    try {
        const userQuery = `
            SELECT * FROM players 
            WHERE username = $1
        `;

        const userResult = await client.query(userQuery, [username]);

        if (userResult.rows.length === 0) {
            console.log("User does not exist:", username);
            return { status: "no_user" };
        }

        const user = userResult.rows[0];

        if (user.password !== password) {
            console.log("Incorrect password for user:", username);
            return { status: "wrong_password" };
        }

        console.log("User authenticated:", username);
        return { status: "success", data: user };

    } catch (err) {
        console.log("Error executing query:", err);
        return { status: "error" };
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
        initResult = await getPlayer(data.username, data.password, client);
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

        case "no_user":
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

        case "wrong_password":
            response = {
                status: "WRONG PASSWORD",
                message: "incorrect password for the user",
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
