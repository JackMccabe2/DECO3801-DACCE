-- ========== DROP EXISTING TABLES (for dev/testing only) ==========
DROP TABLE IF EXISTS tutorial_levels, player_stats, player_history, puzzle_history, each_round, current_match, match_results, game_types, leaderboard, puzzles, players CASCADE;

-- ========== PLAYER TABLE ==========
CREATE TABLE public.players (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    last_active TIMESTAMP NOT NULL,
    firewall_skill INTEGER CHECK (firewall_skill BETWEEN 1 AND 100),
    encipher_skill INTEGER CHECK (encipher_skill BETWEEN 1 AND 100),
    leaderboard_score INTEGER DEFAULT 0
);

-- ========== LEADERBOARD ==========
CREATE TABLE public.leaderboard (
    players_username VARCHAR(50) UNIQUE,
    players_leaderboard_score INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);

-- ========== PUZZLES ==========
CREATE TABLE public.puzzles (
    puzzle_id VARCHAR(50) PRIMARY KEY,
    difficulty INTEGER
);

-- ========== MATCH RESULTS ==========
CREATE TABLE public.match_results (
    match_id INTEGER PRIMARY KEY,
    players_username VARCHAR(50),
    player_score INTEGER CHECK (player_score BETWEEN 0 AND 5),
    opponent_score INTEGER CHECK (opponent_score BETWEEN 0 AND 5),
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);

-- ========== GAME TYPES ==========
CREATE TABLE public.game_types (
    encryption_id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) CHECK (game_type IN ('firewall', 'encryption')),
    cipher_method VARCHAR(50)
);

-- Sample data
INSERT INTO game_types (game_type, cipher_method) VALUES 
('encryption', 'Caesar Cipher'),
('encryption', 'AES'),
('encryption', 'XOR gate');

-- ========== CURRENT MATCH ==========
CREATE TABLE public.current_match (
    players_username VARCHAR(50),
    match_id INTEGER PRIMARY KEY,
    answers_right INTEGER,
    answers_wrong INTEGER,
    player_score INTEGER,
    opponent_score INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (match_id) REFERENCES match_results(match_id) ON DELETE CASCADE
);

-- ========== EACH ROUND ==========
CREATE TABLE public.each_round (
    match_id VARCHAR(50),
    players_username VARCHAR(50),
    puzzle_id VARCHAR(50),
    duration INTEGER,
    win_loss VARCHAR(4) CHECK (win_loss IN ('win', 'loss')) NOT NULL,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id) ON DELETE CASCADE
);

-- ========== PUZZLE HISTORY ==========
CREATE TABLE public.puzzle_history (
    puzzle_id VARCHAR(50),
    duration INTEGER,
    win_loss VARCHAR(4) CHECK (win_loss IN ('win', 'loss')) NOT NULL,
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(puzzle_id) ON DELETE CASCADE
);

-- ========== PLAYER HISTORY ==========
CREATE TABLE public.player_history (
    id SERIAL PRIMARY KEY,
    players_username VARCHAR(50),
    game_id INTEGER NOT NULL,
    game_date DATE NOT NULL,
    win_loss VARCHAR(4) CHECK (win_loss IN ('win', 'loss')) NOT NULL,
    leaderboard_points INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES current_match(match_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES current_match(match_id) ON DELETE CASCADE
);

-- ========== PLAYER STATS ==========
CREATE TABLE public.player_stats (
    players_username VARCHAR(50) PRIMARY KEY,
    wins INTEGER,
    losses INTEGER,
    leaderboard_points INTEGER,
    player_level INTEGER,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE,
    FOREIGN KEY (players_username) REFERENCES leaderboard(players_username) ON DELETE CASCADE
);

-- ========== TUTORIAL LEVELS ==========
CREATE TABLE public.tutorial_levels (
    level_id SERIAL PRIMARY KEY,
    level INTEGER CHECK (level > 0),
    topic VARCHAR(50),
    passed BOOLEAN DEFAULT FALSE,
    players_username VARCHAR(50),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (players_username) REFERENCES players(username) ON DELETE CASCADE
);

-- ========== LEADERBOARD QUERY ==========
-- Optional: view for leaderboard with ranking
SELECT 
    players_username,
    players_leaderboard_score,
    RANK() OVER (ORDER BY players_leaderboard_score DESC) AS players_leaderboard_position
FROM public.leaderboard;