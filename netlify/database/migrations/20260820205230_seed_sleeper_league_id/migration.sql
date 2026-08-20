-- Pre-configure the league's Sleeper sync settings so the scheduled sync has something to work
-- with as soon as teams are mapped to Sleeper rosters in the admin dashboard.

INSERT INTO league_sync_settings (sleeper_league_id, season, last_sync_message)
VALUES ('1312192910556405760', 2026, 'Not synced yet — map teams to Sleeper rosters, then sync.');
