utils folder contains all the utility files referenced directly/indirectly from the server index1.js

handleMessage.js:
    - handle message is the first port of call for the server functionalty 
    - parses the message to figure out what type it is
    - if message is type 'log' just log on console
    - if any error happens during this process, log on command line and send error message back to client

sendMessage.js:
    - when function okMessage called, it simply sends a message back to client with status "OK" and an associated response body

initPlayer.js:
    - function createUser
    - called when user is signing up new account from client side with message status 'POST'
    
    - initializePlayer called within the file which accesses the PSQL db through the 'client' variable and attempts to add a player
    - if successful, it returns "success"
    - if duplicate, it returns "duplicate"
    - if error, it returns error
    
    - back in createUser, this result is converted to a readable response that is sent back to the client
    - if the user is successfully created, the username is added to the list of active users in activeUser and the variable for the current user is set with ws.userId

loginPlayer.js:
    - function loginUser
    - called when user is signing up new account from client side with message status 'GET USER'
    - the entered username is compared to the list of active users, and if there is already an active user with this username, return status "active"
    
    - getPlayer called within the file which accesses the PSQL db through the 'client' variable and attempts to retrive the username
    - if successful, it returns "success"
    - if non existent, it returns "empty"
    - if error, it returns error

    - back in loginUser, this result is converted to a readable response that is sent back to the client, with status of "success", "empty", "active" or "error"
    - if status is success, username is added to list of active users and current user with ws.userId

getLeaderboard.js:
    - function getLeaderboard
    - called when user sends message with status 'GET LEADERBOARD'
    - query sent to PSQL through client variable to retrieve all the usernames and their associated scores, ordered by their scores
    - result is mapped so that their ranking is added to their row
    - response is returned to client

initGame.js:
    - function initGame
    - called when user starts a game and sends message with status "INIT GAME"
    - random id is created for the unique game id
    - id is added to the gameId array as well as the user's username and the user information
    - the game mode is also added to the gameIds, "M" specifying multiplayer and "S" specifying singleplayer
    - further down the line, this will be the place where match making will happen, by comparing user's scores and finding an adquate user match
    - also later, if a match is found between two players, the user will have thier username added under "users" next to their opponent and their user data added under "userdata" also next to their opponent
    - an OK message is sent, later will add fucntionality that this will only be sent when there are no errors occuring

getPuzzle.js:
    - function getPuzzle
    - currently set up with a default puzzle for testing purposes
    - later will add ability to retrieve puzzle question and answer from game_ai.py
    - puzzle is sent back to user

leaveMultiplayerGame.js:
    - function leaveMultiplayerGame
    - called with "EXIT GAME"
    - loops through gameIds
    - if user's username is present in any, under "users", then it is removed
    - if the user is the only one assinged to that gameId, then the gameId is removed, otherwise it remains
    - response sent back to user "OK" if removed or "NOT FOUND" if wasnt found

    - later will be adjusted to accomodate for single and multiplayer games