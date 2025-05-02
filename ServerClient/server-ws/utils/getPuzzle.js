
export async function getPuzzle(ws) {
    const response = {status: "PUZZLE", 
        data: 
            {question: "whats the most youve ever lost on a coin toss",
                answer: "everything"
            }
        };

    ws.send(JSON.stringify(response));
    
}
