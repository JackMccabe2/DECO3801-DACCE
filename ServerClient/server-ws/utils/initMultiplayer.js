
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initMultiplayer(ws, gameId, username) {
    
    const id = Math.random().toString(16).slice(2);

    gameId.push({ [id]: username });

    await wait(1000);
    console.log(gameId)

}

module.exports = { initMultiplayer };