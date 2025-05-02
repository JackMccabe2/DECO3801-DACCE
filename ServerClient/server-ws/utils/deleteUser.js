
/*
 * function to delete player from database
 *
 * 
 * 
 */
async function deletePlayer(username, client) {
    try {
        // Check if the user exists first
        const checkQuery = `SELECT * FROM players WHERE username = $1`;
        const checkResult = await client.query(checkQuery, [username]);

        if (checkResult.rows.length === 0) {
            return { status: "empty" }; // User does not exist
        }

        const deleteQuery = `DELETE FROM players WHERE username = $1`;
        await client.query(deleteQuery, [username]);

        return { status: "success", data: username }; // Deletion successful
    } catch (err) {
        console.error("Error executing delete query:", err);
        return { status: "error" }; // Database error
    }
}

/*
 *  function to attempt to create specified user
 *  sends response back to client
 */
export async function deleteUser(ws, data, client, activeUsers) {
    let deleteResult;

    const index = activeUsers.indexOf(data.username);
    if (index !== -1) {
        deleteResult = { status: "active" }; // Cannot delete active user
    } else {
        deleteResult = await deletePlayer(data.username, client);
    }

    let response;

    switch (deleteResult.status) {
        case "success":
            response = {
                status: "OK USER DELETED",
                message: "User successfully deleted from the database.",
                user: deleteResult.data
            };
            break;

        case "active":
            response = {
                status: "USER ACTIVE",
                message: "User is currently active and cannot be deleted.",
                user: data.username
            };
            break;

        default:
            response = {
                status: "ERROR",
                message: "An error occurred while deleting the user.",
                user: data.username
            };
            break;
    }

    console.log('[Server] Sending response:', response.status, data.username);
    ws.send(JSON.stringify(response));
}
