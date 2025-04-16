
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function initMultiplayer(ws, gameId) {
    
    gameId.push(Math.floor(Math.random() * 100))

    await wait(1000);
    console.log(gameId)



}

module.exports = { initMultiplayer };