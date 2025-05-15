
/*
async function addGameToDB(data, user, client) {


}
*/

async function addScore(username, client) {
    try {
        const query = `
            UPDATE players
            SET leaderboard_score = leaderboard_score + 1
            WHERE username = $1
            RETURNING *;
        `;

        const result = await client.query(query, [username]);
        console.log("1 record updated");
        return { status: "UPDATE USER", data: result.rows[0] };
    } catch (err) {
        console.log("Error executing query:", err);
        return { status: "ERROR UPDATING USER" };
    }
}

export async function handleWinGame(ws,client,user)
{
    const userUpdate = await addScore(user, client);

    const payload = { 
        status: userUpdate.status,
        user: userUpdate.data 
    };

    console.log('[Server] Sending response:', payload.status, payload.user);
    ws.send(JSON.stringify(payload));

    //await addGameToDB(data,user,client);
    // add query to database to add the game stat
}