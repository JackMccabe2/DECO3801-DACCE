-- PLAYER
-- each user is a new entry to table
CREATE TABLE public.players (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    last_active TIMESTAMP NOT NULL,
    firewall_skill INTEGER CHECK (firewall_skill BETWEEN 1 AND 100),
    encipher_skill INTEGER CHECK (encipher_skill BETWEEN 1 AND 100),
    leaderboard_score INTEGER DEFAULT 0
);

-- when player gets answer wrong, update table by incrementing answer wrong and wrong_answer_question_type
CREATE TABLE public.current_match (
    players_username VARCHAR(50),
    answers_right INTEGER,
    answers_wrong INTEGER,
    wrong_answer_question_type REFERENCES games.cipher_method,
    player_score INTEGER,
    opponent_score INTEGER,

    
    
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
)
--need to add table for each individual puzzle within a game

-- GAMES
-- each game creates new entry, right now just covers game types
CREATE TABLE public.games (
    game_id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) CHECK (game_type IN ('firewall', 'encryption')),
    cipher_method VARCHAR(50),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO games (cipher_method, difficulty)
VALUES ('Caesar Cipher', 2);

INSERT INTO games (cipher_method, difficulty)
VALUES ('AES', 8);

INSERT INTO games (cipher_method, difficulty)
VALUES ('XOR gate', 4);

--need to create a table specifically for each individual game/puzzle i think

-- might be able to merge with table below, this one covers both players but still from representation of one player
CREATE TABLE public.game_results (
    result_id SERIAL PRIMARY KEY,
    players_username VARCHAR(50),
    player_score INTEGER CHECK (player_score BETWEEN 0 AND 5),
    opponent_score INTEGER CHECK (opponent_score BETWEEN 0 AND 5),
    game_id INTEGER,
    difficulty_rating INTEGER,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    winner_leaderboard_points INTEGER NOT NULL,
    loser_leaderboard_points INTEGER NOT NULL,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);



-- GAME HISTORY
-- each game creates new entry to table, 
CREATE TABLE public.player_games (
    id SERIAL PRIMARY KEY,
    players_username VARCHAR(50),
    game_id INTEGER NOT NULL,
    game_date DATE NOT NULL,
    win_loss VARCHAR(4) CHECK (win_loss IN ('win', 'loss')) NOT NULL,
    leaderboard_points INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (opponents_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- players game history/record recorded
CREATE TABLE public.player_history (
    players_username VARCHAR(50),
    wins INTEGER,
    losses INTEGER,
    leaderboard_points INTEGER REFERENCES leaderboard(username)
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
)



-- TUTORIALS
-- stores which tutorials player has done
CREATE TABLE public.tutorial_levels (
    level_id SERIAL PRIMARY KEY,
    level INTEGER CHECK (level > 0),
    topic VARCHAR(50),
    passed BOOLEAN DEFAULT FALSE,
    players_username VARCHAR(50),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);



--LEADERBOARD
-- stores leaderboard scores
CREATE TABLE public.leaderboard (
    players_username VARCHAR(50),
    players_leaderboard_score INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE

);

--sorts scores in descending order
SELECT 
    players_username,
    players_leaderboard_score,
    RANK() OVER (ORDER BY players_leaderboard_score DESC) AS players_leaderboard_position
FROM public.leaderboard;



-- FIREWALL
-- whether game is running, what players are doing, game score
CREATE TABLE public.firewall_game_state (
    game_id INTEGER PRIMARY KEY,
    attacker_username VARCHAR(50),
    defender_username VARCHAR(50),
    attacker_action VARCHAR(100),  -- e.g., "scanning", "exploiting", "spoofing"
    defender_action VARCHAR(100),  -- e.g., "deploying firewall", "tracing attack"
    attacker_progress INTEGER,  -- percentage of attack progress 
    defender_progress INTEGER,  -- percentage of defense progress 
    game_status VARCHAR(20) CHECK (game_status IN ('ongoing', 'completed')),  -- game status
    last_action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- timestamp of last action
    FOREIGN KEY (attacker_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (defender_username) REFERENCES players(username) ON DELETE CASCADE
);

-- different attacking/defending tools, their effectiveness, cooldowns,
CREATE TABLE public.player_tools (
    tool_id SERIAL PRIMARY KEY,
    players_username VARCHAR(50),
    tool_name VARCHAR(50),  -- e.g., "SQL Injection", "DDoS", "Rate-Limiting", "Honeypot"
    tool_type VARCHAR(20) CHECK (tool_type IN ('attacker', 'defender')),  -- attacker or defender
    cooldown_time INTEGER,  -- time in seconds before the tool can be used again
    power INTEGER,  -- effectiveness or power of the tool
    in_use BOOLEAN DEFAULT FALSE,  -- track if the tool is in use
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);

-- actions players are performing, records time can be used to notify other player x seconds after
CREATE TABLE public.player_actions (
    action_id SERIAL PRIMARY KEY,
    game_id INTEGER,
    player_username VARCHAR(50),
    action_type VARCHAR(50),  -- e.g., "scan", "exploit", "deploy defense"
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_details TEXT,  -- details of the action (e.g., IP address attacked, exploit used)
    action_result VARCHAR(50) CHECK (action_result IN ('success', 'failure')),  -- success or failure of the action
    FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE,
    FOREIGN KEY (player_username) REFERENCES public.players(username) ON DELETE CASCADE
);

-- game timer
CREATE TABLE public.match_timers (
    game_id INTEGER PRIMARY KEY,
    match_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    match_end TIMESTAMP,  -- will be set when game ends
    time_remaining INTEGER,  -- time in seconds until match ends
    FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE
);

-- not sure if this is necessary just yet
CREATE TABLE public.player_progress (
    players_username VARCHAR(50),
    current_game_id INTEGER,
    attacker_skill INTEGER CHECK (attacker_skill BETWEEN 1 AND 100),
    defender_skill INTEGER CHECK (defender_skill BETWEEN 1 AND 100),
    attacker_tools_acquired INTEGER[],  -- list of tools acquired during game
    defender_tools_acquired INTEGER[],  -- list of tools acquired during game
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (current_game_id) REFERENCES public.games(game_id) ON DELETE CASCADE
);
