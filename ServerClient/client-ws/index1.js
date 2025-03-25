// websocket
const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const readline = require('readline');

// WebSocket initialization
let ws_host = 'localhost';
let ws_port = '3000';
const options = { constructor: Html5WebSocket };
const rws = new ReconnectingWebSocket('ws://' + ws_host + ':' + ws_port + '/ws', undefined, options);
rws.timeout = 1000;

rws.addEventListener('open', () => {
    console.log('[Client] Connection to WebSocket was opened.');
    rws.send('Hello, this is a message from a client.');
    rws.send(JSON.stringify({ 
        method: 'set-background-color',
        params: {
            color: 'blue'
        }
    }));
    //rl.setPrompt('Enter message to send: ');
    //rl.prompt();
    console.log('Enter message to send to server: ')
    startCommandLineInput();
});

rws.addEventListener('message', (e) => {
    console.log('[Client] Message received: ' + e.data);
    
    try {
        let m = JSON.parse(e.data);
        handleMessage(m);
    } catch (err) {
        console.log('[Client] Message is not parseable to JSON.');
    }
});

rws.addEventListener('close', () => {
    console.log('[Client] Connection closed.');
});

rws.onerror = (err) => {
    if (err.code == 'EHOSTDOWN') {
        console.log('[Client] Error: server down.');
    }
};

// Handlers
let handlers = {
    "set-background-color": function (m) {
        console.log('[Client] set-background-color handler.');
    }
};

function handleMessage(m) {
    
    if (!m.method) {
        return;
    }

    let method = m.method;

    if (handlers[method]) {
        handlers[method](m);
    } else {
        console.log('[Client] No handler defined for method ' + method + '.');
    }

}

// Command Line Input Function
function startCommandLineInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    

    rl.on('line', (line) => {
        if (line.toLowerCase() === 'exit') {
            console.log('[Client] Exiting...');
            rl.close();
            rws.close();
            return;
        }
        rws.send(line);
        rl.prompt();
    });
}