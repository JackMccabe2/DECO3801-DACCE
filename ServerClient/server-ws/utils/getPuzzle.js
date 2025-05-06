import { spawn } from 'child_process';

export async function getPuzzle(ws) {
    const python = spawn('python3', ['../../game_ai.py']);
    let dataString = '';
    
    python.stdout.on('data', (data) => {
        dataString += data.toString();
      });
    
      python.stdout.on('end', () => {
        const puzzle = JSON.parse(dataString);
        console.log(puzzle.question)
        console.log(puzzle.answer, " <-- answer")
        
        const response = {
          status: "PUZZLE",
          data: {
            question: puzzle.question,
            answer: puzzle.answer
          }
        };
    
        ws.send(JSON.stringify(response));
      });
}
