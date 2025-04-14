
async function getPuzzle(ws) {
    
    response = {status: "PUZZLE", 
        data: 
            {question: "whats the most youve ever lost on a coin toss",
                answer: "everything"
            }
        }

    ws.send(JSON.stringify(response));

}

module.exports = { getPuzzle };