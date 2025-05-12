Folder for the server

To run the server, type in command line:
    node index1.js

index1.js functionality:
    
    INITIAL CONNECTION
    - opens port to listen on at 8080
    - creates websocket server on that port
    - connects to PSQL db with login details
    
    GLOBAL VARIABLES
    - gameId used to track the games that are running with unique ids, more on this later
    - activeUsers used to track the users that are logged in

    CLIENT CONNECTION
    - when a client is connected, it will be logged on the console and current user is set to null (unique username only tracked once user is logged in)
    - when the server recieves a message from the client it will handle it using handleMessage, imported from '/utils/handleMessage'
    - when client logs out, they will be removed from active users

