
/*
 * function to add new player to database
 *
 * 
 * 
 */
async function getLeaderboard(ws, client) {
    /*
    try {
        const query = `
            SELECT username, leaderboard_score
            FROM players
            ORDER BY leaderboard_score DESC
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
    */

    let response;

    try {

        const query = `
            SELECT username, leaderboard_score
            FROM players
            ORDER BY leaderboard_score DESC
        `;

        const result = await client.query(query);
        // Optional: check if rows were returned
        if (result.rows.length === 0) {
          console.log("No players found.");
          response = {status: "EMPTY"};
          // maybe return an empty array to the frontend
        } else {
          const leaderboardData = result.rows.map((row, index) => ({
            rank: index + 1,
            name: row.username,
            score: row.leaderboard_score
          }));
      
          // send this to frontend, return from function, etc.
          //console.log("leaderboard data: " + leaderboardData);
          response = {status: "SUCCESS", data: leaderboardData};
        }
      
      } catch (err) {
        console.error("Database query failed:", err.message);
        response = {status: "ERROR"};
      }

      console.log('[Server] Sending response:', response);
      ws.send(JSON.stringify(response));
}

module.exports = { getLeaderboard };