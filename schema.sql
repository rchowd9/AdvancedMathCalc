-- SQLite schema for persisting Math Quest progress and calculation history.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS player_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL DEFAULT 'Player One',
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  streak INTEGER NOT NULL DEFAULT 1 CHECK (streak >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  quests_completed INTEGER NOT NULL DEFAULT 0 CHECK (quests_completed >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calculation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  expression TEXT NOT NULL,
  result TEXT,
  category TEXT,
  was_successful INTEGER NOT NULL DEFAULT 1 CHECK (was_successful IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES player_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_achievements (
  player_id INTEGER NOT NULL,
  achievement_id INTEGER NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, achievement_id),
  FOREIGN KEY (player_id) REFERENCES player_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_calculation_history_player_created
  ON calculation_history(player_id, created_at DESC);

INSERT OR IGNORE INTO achievements (slug, name, description) VALUES
  ('starter', 'Starter', 'First correct solve'),
  ('graph-explorer', 'Graph Explorer', 'Plot your first function'),
  ('derivative-pro', 'Derivative Pro', 'Complete a derivative challenge'),
  ('math-master', 'Math Master', 'Earn 250 XP'),
  ('renaissance-solver', 'Renaissance Solver', 'Use 6 different math categories');
