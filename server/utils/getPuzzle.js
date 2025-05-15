import { spawn } from 'child_process';

export async function getPuzzle(ws) {
  
  try {
  
    const python = spawn('python3', ['game_ai.py']);
    let dataString = '';
    console.log('[Server] Raw output from Python:', dataString);
    python.stderr.on('data', (err) => {
      console.error('[PYTHON STDERR]', err.toString());
    });

    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    

    python.stdout.on('end', () => {
      
      const puzzle = JSON.parse(dataString);
      
      const response = {
        status: "PUZZLE",
        data: {
          id: puzzle.id,
          type: puzzle.type,
          question: puzzle.question,
          answer: puzzle.answer
        }
      };
  
      console.log('[Server] Sending response:', response.status, response.data);
      ws.send(JSON.stringify(response));
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    ws.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
  }
}
