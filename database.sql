-- Players Table
CREATE TABLE public.players (
    username VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    last_active TIMESTAMP NOT NULL,
    firewall_skill INTEGER CHECK (firewall_skill BETWEEN 1 AND 100),
    encipher_skill INTEGER CHECK (encipher_skill BETWEEN 1 AND 100),
    leaderboard_score INTEGER DEFAULT 0
);

-- Games Table
CREATE TABLE public.games (
    game_id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) CHECK (game_type IN ('firewall', 'encryption')),
    cipher_method VARCHAR(50),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game Results Table
CREATE TABLE public.game_results (
    result_id SERIAL PRIMARY KEY,
    players_username VARCHAR(255),
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

-- Player Games Table
CREATE TABLE public.player_games (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    game_id INTEGER NOT NULL,
    game_date DATE NOT NULL,
    win_loss VARCHAR(4) CHECK (win_loss IN ('win', 'loss')) NOT NULL,
    leaderboard_points INTEGER,
    FOREIGN KEY (username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Tutorial Levels Table
CREATE TABLE public.tutorial_levels (
    level_id SERIAL PRIMARY KEY,
    level INTEGER CHECK (level > 0),
    topic VARCHAR(255),
    passed BOOLEAN DEFAULT FALSE,
    players_username VARCHAR(255),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);

CREATE TABLE public.leaderboard (
    players_username VARCHAR(255),
    players_leaderboard_score INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE

);

SELECT 
    players_username,
    players_leaderboard_score,
    RANK() OVER (ORDER BY players_leaderboard_score DESC) AS players_leaderboard_position
FROM public.leaderboard;